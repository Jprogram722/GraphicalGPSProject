# Graphical GPS Project

A GPS web application meant to run on a Raspberry Pi. Draws a map, gets your location, and moves your position accordingly.

## Requirements/Installation

Install the Python dependencies within `requirements.txt` and the Node packages listed within `static/package.json`:
```
pip install -r requirements.txt
cd static/
npm install
```

In addition, you'll need a .PMTiles file placed within `static/maps` and an [OSRM server](https://github.com/Project-OSRM/osrm-backend/releases) running on `localhost:5500`.

You can get the PMTiles CLI [here](https://github.com/protomaps/go-pmtiles) and find the basemaps [here](https://maps.protomaps.com/builds/).
To download the basemaps for Nova Scotia run
```
pmtiles extract [LATEST BASEMAP] nova_scotia.pmtiles --bbox=-66.456299,43.371009,-59.639282,47.073875
```

For routing data, you'll need an OpenStreetMap data extract. See [Geofabrik](http://download.geofabrik.de/) for regional extracts.
Run the tool chain (you may need the [profiles directory](https://github.com/Project-OSRM/osrm-backend/tree/master/profiles) placed next to your executables):
```
osrm-extract nova_scotia-latest.osm.pbf
osrm-partition nova_scotia-latest.osrm
osrm-customize nova_scotia-latest.osrm

osrm-routed --algorithm=MLD --port=5500 nova_scotia-latest.osrm
```

## Running

After all that, run `flask run` within root to start the GPS at `localhost:5000`