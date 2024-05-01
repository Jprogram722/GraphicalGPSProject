# Graphical GPS Project

A GPS web application meant to run on a Raspberry Pi. Draws a map, gets your location, and moves your position accordingly.

## Requirements/Installation

A Python virtual environment is recommended.

Install the Python dependencies within `requirements.txt` and the Node packages listed within `static/package.json`:
```
pip install -r requirements.txt
cd static/
npm install
```

In addition, you'll need a .PMTiles file placed within `static/maps` and an OSRM server running on `localhost:5500`.

You can get the PMTiles CLI [here](https://github.com/protomaps/go-pmtiles) and find the basemaps [here](https://maps.protomaps.com/builds/).
To download the basemaps for Nova Scotia run
```
pmtiles extract [LATEST BASEMAP] nova_scotia.pmtiles --bbox=-66.456299,43.371009,-59.639282,47.073875
```

For routing data, you'll need an OpenStreetMap data extract. See [Geofabrik](http://download.geofabrik.de/) for regional extracts.
Either compile osrm-backend from source or [use the Docker images](https://github.com/Project-OSRM/osrm-backend?tab=readme-ov-file#using-docker) to preprocess the data.
**ON ARM64 DEVICES (E.G. Raspberry Pi) USE THE [kradenko/osrm-backend:arm64](https://hub.docker.com/r/kradenko/osrm-backend) CONTAINERS**

Run the server like so:
```
docker run -t -i -p 5500:5500 -v "${PWD}:/data" ghcr.io/project-osrm/osrm-backend osrm-routed --algorithm mld --port 5500 /data/nova-scotia-latest.osrm
```
or like this, if you're on an ARM64 device:
```
docker run -t -i -p 5500:5500 -v ${PWD}:/data kradenko/osrm-backend:arm64 osrm-routed --algorithm mld --port 5500 /data/nova-scotia-latest.osrm
```

## Running

After all that, run `flask run` within root to start the GPS at `localhost:5000`
