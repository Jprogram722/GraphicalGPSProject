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

### PMTiles

The .PMTiles file makes up the images that comprise the map. The pictures of the roads, buildings, etc. are all stored within a .pmtiles archive. Our JavaScript file requests the Flask server for a specific file in the archive so that it can render it on the map.

To get a PMTiles file for a specific region, [download the command line tool here.](https://github.com/protomaps/go-pmtiles/releases/latest) You'll also need a link to the [latest basemap here](https://maps.protomaps.com/builds/) (right click download > copy link)

Once you have both of those things, you can run the executable within a terminal window. For example, to extract a .pmtiles archive for only Nova Scotia, run the following:
```
pmtiles extract [LATEST BASEMAP] nova_scotia.pmtiles --bbox=-66.456299,43.371009,-59.639282,47.073875
```

Place inside `static/maps` once you have your result.

### Routing
Download a regional data extract for your region, for example at [Geofabrik](http://download.geofabrik.de/). The `osm.pbf` file is what you want.

Unpack the data into `osrm.*` files with the `osrm/osrm-backend` docker images before running the server. You'll need the Docker Engine for this.
**IF YOU'RE ON AN ARM64 DEVICE (E.G. Raspberry Pi) REPLACE EVERY `osrm/osrm-backend` WITH [`kradenko/osrm-backend:arm64`](https://hub.docker.com/r/kradenko/osrm-backend):**

Preprocess the data:
```
docker run -t -v "${PWD}:/data" osrm/osrm-backend osrm-extract -p /opt/car.lua /data/<your-file>.osm.pbf
```
Partition and customize the data:
```
docker run -t -v "${PWD}:/data" osrm/osrm-backend osrm-partition /data/<your-file>.osrm
docker run -t -v "${PWD}:/data" osrm/osrm-backend osrm-customize /data/<your-file>.osrm
```

## Running

Finally, run the routing server like so:
```
docker run -t -i -p 5500:5500 -v "${PWD}:/data" osrm/osrm-backend osrm-routed --algorithm mld --port 5500 /data/nova-scotia-latest.osrm
```

Then run the Python script. Your GPS should be available on localhost:5000.
