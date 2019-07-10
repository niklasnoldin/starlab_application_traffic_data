const csv = require("csv-parser");
const fs = require("fs");

const getStreetData = () => {
  return new Promise((resolve, reject) => {
    let streets = new Map();
    fs.createReadStream("transit_relacio_trams_format_long.csv")
      .pipe(csv())
      .on("data", data => {
        if (!streets.has(data.Tram))
          streets.set(data.Tram, {
            name: data["Descripció"],
            coordinates: []
          });
        let currStreet = streets.get(data.Tram);
        currStreet.coordinates.push([
          parseFloat(data.Longitud),
          parseFloat(data.Latitud)
        ]);
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
            day: parseInt(data.data.substring(6, 8)) - 1,
            timestamp: data.data.slice(0, -2),
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
  let dataPerDay = Array(30);
  trafficData.forEach(data => {
    let street = streetData.get(data.id);
    if (street) {
      if (!dataPerDay[data.day]) dataPerDay[data.day] = new Map();
      let singleDay = dataPerDay[data.day];
      if (!singleDay.has(data.timestamp)) singleDay.set(data.timestamp, []);
      let timestampArray = singleDay.get(data.timestamp);
      timestampArray.push({
        streetId: data.id,
        traffic: data.traffic,
        coordinates: street.coordinates,
        name: street.name
      });
    } else {
      //console.error("Street with id not found:" + data.id);
    }
  });
  return dataPerDay;
};

const generateGeoJsonFromData = dataPerDay => {
  dataPerDay.forEach((singleDay, idx) => {
    singleDay.forEach((timestampArray, timestamp) => {
      let geoJson = {
        type: "FeatureCollection",
        features: []
      };
      timestampArray.forEach(street => {
        let geoJsonData = {
          type: "Feature",
          properties: {
            trafficIntensity: street.traffic,
            name: street.name
          },
          geometry: {
            type: "LineString",
            coordinates: street.coordinates
          }
        };
        geoJson.features.push(geoJsonData);
      });

      let basePath = `output/${idx + 1}`;
      let filename = `${timestamp}.json`;

      if (!fs.existsSync("output")) fs.mkdirSync("output");

      if (!fs.existsSync(basePath)) fs.mkdirSync(basePath);

      fs.writeFile(`${basePath}/${filename}`, JSON.stringify(geoJson), err => {
        if (err) throw err;
        else console.log(`File saved successfully: ${timestamp}.json`);
      });
    });
  });
};

const main = async () => {
  try {
    console.log("reading data");
    const [streetData, trafficData] = await Promise.all([
      getStreetData(),
      getTrafficData()
    ]);
    console.log("finished reading data");
    let dataPerDay = orderData(streetData, trafficData);
    console.log("ordered data");
    generateGeoJsonFromData(dataPerDay);
    console.log("finished");
  } catch (e) {
    console.log("An error occured");
    console.log(e);
  }
};

main();
