let map = L.map('map', { zoomControl: false });

(async () => {

    /**
     * This function will update the coordinates for the user marker.
     * it will also use the old and new coordinates to calculate the bearing for the rotation angle
     * and apply the rotation to the user marker.
     * @param {Array} coordinates 
     */
    const updateMarker = (coordinates) => {

        // store the coordinates before updating
        previousMaker.setLatLng(new L.LatLng(currentMarker._latlng.lat, currentMarker._latlng.lng));
        
        // Update marker position to the new center
        currentMarker.setLatLng(new L.LatLng(coordinates[0], coordinates[1]));

        // Update the route
        updateRoute();

    };

    const rotateMarker = (bearing) => {
        currentMarker.setRotationAngle(bearing);
        updateBearingOverlay(bearing);
    }

    const updateLatLongOverlay = () => {
	    coordinatesTag.textContent = `Latitude: ${currentMarker._latlng.lat}, Longitude: ${currentMarker._latlng.lng}`;
    }

    const updateBearingOverlay = (bearing) => {
        if(bearing > 345 || bearing <= 30){
            direction.textContent = "N";
        }
        else if (bearing > 30 && bearing < 75){
            direction.textContent = "NE";
        }
        else if (bearing >= 75 && bearing <= 120){
            direction.textContent = "E";
        }
        else if (bearing > 120 && bearing < 165){
            direction.textContent = "SE";
        }
        else if (bearing >= 165 && bearing <= 210){
            direction.textContent = "S";
        }
        else if (bearing > 210 && bearing < 255){
            direction.textContent = "SW";
        }
        else if (bearing >= 255 && bearing <= 300){
            direction.textContent = "W";
        }
        else if (bearing > 300 && bearing < 345){
            direction.textContent = "NW";
        }
    }

    const updateRoute = () => {
        if (routeEnd._container.value != -1) {
            var end = locations[routeEnd._container.value];
            // program craps itself if start + destination are the same
            waypoints = [
                currentMarker.getLatLng(),
                L.latLng(end.lat, end.lng)
            ];
            if (waypoints[0].lat !== waypoints[1].lat || waypoints[0].lng !== waypoints[1].lng) {
                mapRouting.setWaypoints(waypoints);
                mapRouting.route();
            }
        }
    }

    // gets the local address
    let server = window.location;

    const coordinatesTag = document.querySelector("#coordinates");
    const direction = document.querySelector("#direction");

    coordinatesTag.textContent = "Loading";
    direction.textContent = "Loading";

    // create the custom icon
    const customIcon = L.icon({
        iconUrl: '/static/images/user.png',
        iconSize: [75, 75], 
        iconAnchor: [36, 60], 
        popupAnchor: [0, -16] 
    });

    // create the route select list
    L.Control.Dropdown = L.Control.extend({
        onAdd: map => {
            var selectList = L.DomUtil.create("select");
            selectList.classList.add("leaflet-location-select")

            defaultText = L.DomUtil.create("option");
            defaultText.text = "Select a destination";
            defaultText.value = -1;
            defaultText.disabled = true;
            defaultText.hidden = true;
            selectList.appendChild(defaultText);
            selectList.value = -1;

            for (var i = 0; i < locations.length; i++) {
                var opt = L.DomUtil.create("option");
                opt.text = locations[i].name;
                opt.value = locations.map(e => e.name).indexOf(locations[i].name);
                selectList.appendChild(opt);
            }

            selectList.onchange = function(){updateRoute()};

            return selectList;
        },
        onRemove: map => {
    
        }
    });
    L.control.dropdown = function(opts) {
        return new L.Control.Dropdown(opts);
    }

    // this will create the map and set the view
    map.setView([44.650627, -63.597140], 16)

    // create 2 markers, one for the user, one for calculating angle
    let currentMarker = L.marker(map.getCenter(), { icon: customIcon, autoPan: false }).addTo(map); // Add marker with custom icon;
    let previousMaker = L.marker(map.getCenter());

    // create the routing functionality
    const mapRouting =  L.Routing.control({
        // FIXME: currently only detects a server running under localhost:5500
        serviceUrl: 'http://localhost:5500/route/v1',
        fitSelectedRoutes: false,
        draggableWaypoints: false,
        addWaypoints: false,
        position: 'bottomright'
    }).addTo(map);
    var routeEnd = L.control.dropdown({ position: 'bottomright' }).addTo(map);

    // fetching arduino data
    (async function getData() {
        try{
            let res = await fetch('/api/get-data');
            let data = await res.json();
            console.log(data);
    
            if(data.Longitude && data.Latitude){
                map.panTo([data.Latitude, data.Longitude]);
                updateMarker([data.Latitude, data.Longitude, data.Bearing]);
		        updateLatLongOverlay();
            }
    
            if(data.Bearing){
                rotateMarker(data.Bearing);
            }  
        }
        catch(err){
            console.log("Couldn't get data")
        }

        setTimeout(getData, 2000);
    })();

    var layer = protomapsL.leafletLayer({url: `${server}/api/maps/nova_scotia.pmtiles`, theme:'light'});
    layer.addTo(map);

    setInterval(() => {
        map.invalidateSize(); // Refresh map size to ensure correct centering
    }, 1000);
    
})();
