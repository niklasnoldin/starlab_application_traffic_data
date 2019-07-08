import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "./App.css";
import "mapbox-gl/dist/mapbox-gl.css";

const initializeMap = () => {
  mapboxgl.accessToken =
    "pk.eyJ1IjoibmlrbGFzbm9sZGluIiwiYSI6ImNqaGh0NWxzZDF4cGczNnFvbnd0ZHJjbHEifQ.9yoH6H8i310Snle05XVYGA";
  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v9",
    center: [2.1302986, 41.384201],
    zoom: 10
  });
  map.on("load", () => {
    //
  });
};

function App() {
  useEffect(() => {
    initializeMap();
  }, []);
  return (
    <div className="App">
      <div id="map" />
    </div>
  );
}

export default App;
