(async () => {

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

    let map = L.map('map', { zoomControl: false });

    // this will create the map and set the view
    map.setView([44.650627, -63.597140], 16)

    // create 2 markers, one for the user, one for calculating angle
    let currentMarker = L.marker(map.getCenter(), { icon: customIcon, autoPan: false }).addTo(map); // Add marker with custom icon;
    let previousMaker = L.marker(map.getCenter());

    // fetching arduino data
    setInterval(async () => {
        let res = await fetch('/api/test-data');
        let data = await res.json();
        console.log(data);

        if(data.Status === "Success"){
            map.setView([data.Latitude, data.Longitude], 14);
            updateMarker([data.Latitude, data.Longitude, data.Bearing]);
        }
    }, 5000);

    var layer = protomapsL.leafletLayer({url: `${server}/api/maps/north_halifax.pmtiles`, theme:'light'});
    layer.addTo(map);

    // this is the marker for the campus
    const campusMarker = L.marker([44.66941024799195, -63.61346907985597]).addTo(map)
        .bindPopup('NSCC IT Campus')
        .openPopup();

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
        updateOverlay(coordinates[2]);

        // Calculate new bearing
        /*
            angle = arctan(y_f - y_i / x_f - x_i)
        */
        // let deltaLat = currentMarker._latlng.lat - previousMaker._latlng.lat;
        // let deltaLng = currentMarker._latlng.lng - previousMaker._latlng.lng;
        // let currentBearing = Math.atan(deltaLng / deltaLat) * (180 / Math.PI);
        // if (deltaLat < 0) {
        //     currentBearing += 180;
        // }
        currentMarker.setRotationAngle(coordinates[2]);
    };

    const updateOverlay = (bearing) => {
        coordinatesTag.textContent = `Latitude: ${currentMarker._latlng.lat}, Longitude: ${currentMarker._latlng.lng}`;
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

    setInterval(() => {
        map.invalidateSize(); // Refresh map size to ensure correct centering
    }, 1000);
    
})();
