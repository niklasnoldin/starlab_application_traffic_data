const csv = require("csv-parser");
const fs = require("fs");

const getStreetData = () => {
  return new Promise((resolve, reject) => {
    let streets = new Map();
    fs.createReadStream("transit_relacio_trams_format_long.csv")
      .pipe(csv())
      .on("data", data => {
        if (!streets.has(data.Tram)) streets.set(data.Tram, []);
        let currStreet = streets.get(data.Tram);
        currStreet.push([data.Longitud, data.Latitud]);
      })
      .on("end", () => {
        resolve(streets);
      });
  });
};

const getTrafficData = () => {
  return new Promise((resolve, reject) => {
    let traffic = [];
    try {
      fs.createReadStream("2019_05_Maig_TRAMS_TRAMS.csv")
        .pipe(csv())
        .on("data", data => {
          traffic.push({
            id: data.idTram,
            day: parseInt(data.data.substring(4, 6)) - 1,
            timestamp: data.data,
            traffic: data.estatActual
          });
        })
        .on("end", () => {
          resolve(traffic);
        });
    } catch (e) {
      reject(e);
    }
  });
};

const orderData = (streetData, trafficData) => {
  let dataPerDay = Array(30).fill(new Map());
  trafficData.forEach(data => {
    let coordinates = streetData.get(data.id);
    let singleDay = dataPerDay[data.day];
    if (!singleDay.has(data.timestamp)) singleDay.set(data.timestamp, []);
    let timestampArray = singleDay.get(data.timestamp);
    timestampArray.push({
      streetId: data.id,
      traffic: data.traffic,
      coordinates: coordinates
    });
  });
  return dataPerDay;
};

const generateGeoJsonFromData = dataPerDay => {
  dataPerDay.forEach(singleDay => {
    singleDay.forEach((timestampArray, timestamp) => {
      let geoJson = {
        type: "FeatureCollection",
        features: []
      };
      timestampArray.forEach(street => {
        let geoJsonData = {
          type: "Feature",
          properties: {
            trafficIntensity: street.traffic
          },
          geometry: {
            type: "LineString",
            coordinates: street.coordinates
          }
        };
        geoJson.features.push(geoJsonData);
      });
      fs.writeFile(
        `./outputJsonFiles/${timestamp}.json`,
        JSON.stringify(geoJson),
        err => {
          if (err) throw err;
          else console.log(`File saved successfully: ${timestamp}.json`);
        }
      );
    });
  });
};

const main = async () => {
  try {
    const [streetData, trafficData] = await Promise.all([
      getStreetData(),
      getTrafficData()
    ]);
    let dataPerDay = orderData(streetData, trafficData);
    generateGeoJsonFromData(dataPerDay);
  } catch (e) {
    console.log("An error occured");
    console.log(e);
  }
};

main();
