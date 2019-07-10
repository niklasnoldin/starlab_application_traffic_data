import React, {
  useEffect
} from "react";
import mapboxgl from "mapbox-gl";
import "./App.css";
import "mapbox-gl/dist/mapbox-gl.css";
import geoJson from "./prepareData/outputJsonFiles/20190501000552.json";

const initializeMap = () => {
  mapboxgl.accessToken =
    "pk.eyJ1IjoibmlrbGFzbm9sZGluIiwiYSI6ImNqaGh0NWxzZDF4cGczNnFvbnd0ZHJjbHEifQ.9yoH6H8i310Snle05XVYGA";
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/niklasnoldin/cjxv3ygpj823a1cpgyb21ay5j",
    center: [2.17, 41.375],
    zoom: 12
  });
  console.log(geoJson);
  map.on("load", () => {
    let timestamp = 20190501000552
    map.addSource("streets", {
      "type": "geojson",
      "data": require(`./prepareData/outputJsonFiles/${timestamp}.json`)
    });

    map.addLayer({
      "id": "traffic-0",
      "type": "line",
      "source": "streets",
      "paint": {
        "line-color": "#fff",
        "line-width": 5
      },
      "filter": ["==", "trafficIntensity", "0"]
    });
    map.addLayer({
      "id": "traffic-1",
      "type": "line",
      "source": "streets",
      "paint": {
        "line-color": "#fdd",
        "line-width": 5
      },
      "filter": ["==", "trafficIntensity", "1"]
    });
    map.addLayer({
      "id": "traffic-2",
      "type": "line",
      "source": "streets",
      "paint": {
        "line-color": "#faa",
        "line-width": 5
      },
      "filter": ["==", "trafficIntensity", "2"]
    });
    map.addLayer({
      "id": "traffic-3",
      "type": "line",
      "source": "streets",
      "paint": {
        "line-color": "#f88",
        "line-width": 5
      },
      "filter": ["==", "trafficIntensity", "3"]
    });
    map.addLayer({
      "id": "traffic-4",
      "type": "line",
      "source": "streets",
      "paint": {
        "line-color": "#f55",
        "line-width": 5
      },
      "filter": ["==", "trafficIntensity", "4"]
    });
    map.addLayer({
      "id": "traffic-5",
      "type": "line",
      "source": "streets",
      "paint": {
        "line-color": "#f33",
        "line-width": 5
      },
      "filter": ["==", "trafficIntensity", "5"]
    });
    map.addLayer({
      "id": "traffic-6",
      "type": "line",
      "source": "streets",
      "paint": {
        "line-color": "#f00",
        "line-width": 5
      },
      "filter": ["==", "trafficIntensity", "6"]
    })
  })
};

function App() {
  useEffect(() => {
    initializeMap();
  }, []);
  return ( < div className = "App" >
    <
    div id = "map" / >
    <
    /div>
  );
}

export default App;