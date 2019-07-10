import { Legend } from "./legend";
import { InputField } from "./InputField";
import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "./App.css";
import "mapbox-gl/dist/mapbox-gl.css";

const initializeMap = (day, timestamp, dashed) => {
  mapboxgl.accessToken =
    "pk.eyJ1IjoibmlrbGFzbm9sZGluIiwiYSI6ImNqaGh0NWxzZDF4cGczNnFvbnd0ZHJjbHEifQ.9yoH6H8i310Snle05XVYGA";
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/niklasnoldin/cjxv3ygpj823a1cpgyb21ay5j",
    center: [2.17, 41.375],
    zoom: 12
  });

  let baseUrl =
    "https://raw.githubusercontent.com/niklasnoldin/niklasnoldin.github.io/master/output";

  map.on("load", () => {
    map.addSource("streets", {
      type: "geojson",
      data: `${baseUrl}/${day}/${timestamp}.json`
    });

    let popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });

    const onMouseLeaveHandler = e => {
      map.getCanvas().style.cursor = "";
      popup.remove();
    };

    const onMouseEnterHandler = e => {
      map.getCanvas().style.cursor = "pointer";

      var coordinates = e.features[0].geometry.coordinates.slice();
      var traffic = e.features[0].properties.trafficIntensity;
      var streetName = e.features[0].properties.name;

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      popup
        .setLngLat(e.lngLat)
        .setHTML(`${streetName}<br>Traffic: ${traffic}`)
        .addTo(map);
    };

    for (let i = 0; i < 7; i++) {
      let paint = dashed
        ? {
            "line-color": `rgb(${64 + 192 * (i / 6)},${64 + 192 / (i + 1)},0)`,
            "line-width": 4,
            "line-dasharray": [i, 6 - i]
          }
        : {
            "line-color": `rgb(${64 + 192 * (i / 6)},${64 + 192 / (i + 1)},0)`,
            "line-width": 4
          };

      map.addLayer(
        {
          id: `traffic-${i}`,
          type: "line",
          source: "streets",
          paint: paint,
          layout: {
            "line-join": "round",
            "line-cap": "round"
          },
          filter: ["==", "trafficIntensity", `${i}`]
        },
        "road-label"
      );
      map.on("mouseenter", `traffic-${i}`, onMouseEnterHandler);
      map.on("mouseleave", `traffic-${i}`, onMouseLeaveHandler);
    }
  });
};

function App() {
  const [day, setDay] = useState(1);
  const [timestamp, setTimestamp] = useState("201905010000");

  const [dashed, setDashed] = useState(false);

  useEffect(() => {
    initializeMap(day, timestamp, dashed);
  }, [day, timestamp, dashed]);

  return (
    <div className="App">
      <InputField
        dashed={dashed}
        setDashed={setDashed}
        day={day}
        setDay={setDay}
        timestamp={timestamp}
        setTimestamp={setTimestamp}
      />
      <div id="map" />
      <Legend />
    </div>
  );
}

export default App;
