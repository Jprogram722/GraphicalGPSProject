# Graphical GPS Project

A GPS web application meant to run on a Raspberry Pi. Draws a map, gets your location, and moves your position accordingly.

## Requirements/Installation

Create a python virtual environment. 
```
python -m venv .venv
source .venv/bin/activate
```
If you want the routing functionality, you'll also need Docker Engine later on in this guide.
Install the Python dependencies within `requirements.txt` and the Node packages listed within `static/package.json`:
```
pip install -r requirements.txt
cd static/
npm install
cd ..
```

### PMTiles

The .PMTiles file makes up the images that comprise the map. The pictures of the roads, buildings, etc. are all stored within a .pmtiles archive. Our JavaScript file requests the Flask server for a specific file in the archive so that it can render it on the map.

To get a PMTiles file for a specific region, [download the command line tool here.](https://github.com/protomaps/go-pmtiles/) You'll also need a link to the [latest basemap here](https://maps.protomaps.com/builds/) (right click download > copy link)

Once you have both of those things, you can use the `extract` command to get a specific region from the full basemap. Pass in a lat/lng bounding box with the `--bbox` parameter, encompassing the whole area you need your GPS to navigate. [bbox finder](http://bboxfinder.com) is a good way to automatically generate a boundary box for your needs.

As an example, this is what generating a .pmtiles file would look like for the entirety of Nova Scotia:
```
pmtiles extract [LATEST BASEMAP] nova_scotia.pmtiles --bbox=-66.45,43.37,-59.63,47.07
```

Place inside `static/maps` once you have your result.

### Routing

While PMTiles is great for map pictures, it doesn't actually contain any data regarding street or building names that we can easily navigate. We need a folder of `osrm.*` files to get that information, which we can then pass to our server to get a route between two points.

To start, you need an `osm.pbf` file. Download a regional data extract for your region, for example at [Geofabrik](http://download.geofabrik.de/).

Unpack the data into `osrm.*` files with the [`kradenko/osrm-backend:arm64`](https://hub.docker.com/r/kradenko/osrm-backend) docker images before running the server.
**IF YOU'RE NOT ON A RASPBERRY PI REPLACE EVERY `kradenko/osrm-backend:arm64` WITH `osrm/osrm-backend`**

Preprocess the data:
```
docker run -t -v "${PWD}:/data" kradenko/osrm-backend:arm64 osrm-extract -p /opt/car.lua /data/<your-file>.osm.pbf
```
Partition and customize the data:
```
docker run -t -v "${PWD}:/data" kradenko/osrm-backend:arm64 osrm-partition /data/<your-file>.osrm
docker run -t -v "${PWD}:/data" kradenko/osrm-backend:arm64 osrm-customize /data/<your-file>.osrm
```

## Running

Finally, run the routing server like so:
```
docker run -t -i -p 5500:5500 -v "${PWD}:/data" kradenko/osrm-backend:arm64 osrm-routed --algorithm mld --port 5500 /data/nova-scotia-latest.osrm
```

Then run the Python script. Your GPS should be available on localhost:5000.

## Physical Setup

This project uses the following commponents

1. Raspberry Pi 4 Model B
2. Adafruit Ultimate GPS Breakout v3
3. GY-271 QMC5883l Magnetometer
4. Freenove 5 Inch Touchscreen Monitor

![alt-text](./physical-pics/RaspberryPi.jpg)