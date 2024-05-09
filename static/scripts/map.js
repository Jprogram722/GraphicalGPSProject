/**
 * Update the coordinates for the user marker.
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
    updateRoute(destinationCoords);

};

/** 
 * Rotate the current location marker and update the bearing overlay with the
 * correct compass direction
 * @param {Number} bearing
 */
const rotateMarker = (bearing) => {
    currentMarker.setRotationAngle(bearing);
    updateBearingOverlay(bearing);
}

/** 
 * Update the current latitude/longitude displayed on the overlay
 * @param {JSON} data
 */
const updateLatLongOverlay = (data) => {
    let HTMLstring = "";
    if(data.Latitude){
       HTMLstring += `Latitude: ${Math.round(currentMarker._latlng.lat * 100) / 100}<br>`; 
    }
    if(data.Longitude){
        HTMLstring += `Longitude: ${Math.round(currentMarker._latlng.lng * 100) / 100}<br>`; 
    }
    if(data.Altitude){
        HTMLstring += `Altitude: ${Math.round(data.Altitude * 100) / 100}<br>`
    }
    if(data.Speed){
        HTMLstring += `Speed: ${Math.round(data.Speed * 100) / 100}`;
    }
    updateStatus(HTMLstring);
}

/** 
 * Update the current compass direction displayed in the overlay.
 * @param {Number} bearing
 */
const updateBearingOverlay = (bearing) => {
    if(bearing > 345 || bearing <= 30){
        updateCompass("N");
    }
    else if (bearing > 30 && bearing < 75){
        updateCompass("NE");
    }
    else if (bearing >= 75 && bearing <= 120){
        updateCompass("E");
    }
    else if (bearing > 120 && bearing < 165){
        updateCompass("SE");
    }
    else if (bearing >= 165 && bearing <= 210){
        updateCompass("S");
    }
    else if (bearing > 210 && bearing < 255){
        updateCompass("SW");
    }
    else if (bearing >= 255 && bearing <= 300){
        updateCompass("W");
    }
    else if (bearing > 300 && bearing < 345){
        updateCompass("NW");
    }
}

let server = window.location;

// create and set map view
let map = L.map('map', { 
    zoomControl: false,
    doubleClickZoom: false,
    scrollWheelZoom: 'center',
    dragging: false
});
map.setView([44.650627, -63.597140], 16);

// Add controls to the map
L.control.toggleDragging({ position: 'bottomleft' }).addTo(map);
L.control.displayStatus({ position: 'topleft'}).addTo(map);
L.control.compass({ position: "topright"}).addTo(map);
mapRouting.addTo(map);

// Listener events
map.on("dblclick", function(event){
    updateRoute(event.latlng)
});

// Markers/layers
const customIcon = L.icon({
    iconUrl: '/static/images/user.png',
    iconSize: [75, 75], 
    iconAnchor: [36, 60], 
    popupAnchor: [0, -16] 
});
const layer = protomapsL.leafletLayer({
    url: `${server}/api/maps/nova_scotia.pmtiles`, 
    theme:'light'
}).addTo(map);
let currentMarker = L.marker(map.getCenter(), { icon: customIcon, autoPan: false }).addTo(map); // Add marker with custom icon;
let previousMaker = L.marker(map.getCenter());

// fetching arduino data
(async function getData() {
    try{
        let res = await fetch('/api/get-data');
        let data = await res.json();
        console.log(data);

        if(data.Longitude && data.Latitude){
            // only move map if panning is disabled
            if (!draggingEnabled) {
                map.panTo([data.Latitude, data.Longitude]);
            }
            updateMarker([data.Latitude, data.Longitude, data.Bearing]);
            updateLatLongOverlay(data);
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