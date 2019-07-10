# Traffic Map of Barcelona

This project was created in the course of an application process as a challenge.
It consists of a map that displays the previous traffic data of the city of Barcelona in a 5 minute interval.
The current state only provides data for May of 2019 but can be expanded to hold further data easily.

The map is based on Mapbox GL and OpenStreetMap.
The frontend was created with React.js and the project was bootstrapped with Create-React-App.

Please find the `prepareData.js` inside of the `prepareData` directory. This contains a script which takes .csv files from the [open data website](http://opendata-ajuntament.barcelona.cat/data/en/dataset/trams) of the city of Barcelona and parses and saves them into geojson files.

The generated files are uploaded to github pages to be served from there, instead of cramming them into this repository. Furthermore the .csv files have also been excluded from the repository to save unnecessary space.

To run the project locally run `git clone https://github.com/niklasnoldin/starlab_application_traffic_data.git` and `yarn start` to start a development server.

The website is published on Netlify and can be found [here](https://starlab-barcelona.netlify.com/).
