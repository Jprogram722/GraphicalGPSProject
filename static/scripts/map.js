(async () => {
    let map = L.map('map');
    map.setView([44.650627, -63.597140], 14)
    let centerMarker = null; // Define the marker variable
    let previousLocation = null;
    let currentBearing = 90;
    
    // fetching sample data
    setInterval(async () => {
        let res = await fetch('/api/test-data');
        let data = await res.json();
        console.log(data);

        if(data.Status === "Success"){
            map.setView([data.Latitude, data.Longitude], 14);
        }
    }, 5000);

    // Define a custom icon using the 'user.png' image
    const customIcon = L.icon({
        iconUrl: '../static/images/user.png',
        iconSize: [75, 75], 
        iconAnchor: [36, 60], 
        popupAnchor: [0, -16] 
    });

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    const campusMarker = L.marker([44.66941024799195, -63.61346907985597]).addTo(map)
        .bindPopup('NSCC IT Campus')
        .openPopup();

    const updateCenterMarker = () => {
        if (centerMarker) {
            map.removeLayer(centerMarker);
            centerMarker = null;
        }
        // get bearing of current direction
        currentLocation = map.getCenter();
        if (previousLocation) {
            deltaLat = currentLocation.lat - previousLocation.lat;
            deltaLng = currentLocation.lng - previousLocation.lng;
            currentBearing = Math.atan(deltaLng / deltaLat) * (180 / Math.PI)
            if (deltaLat < 0) {
                currentBearing += 180;
            }
        }
        previousLocation = map.getCenter();
        // Add marker to map
        centerMarker = L.marker(currentLocation, { icon: customIcon, autoPan: false, rotationAngle: currentBearing }) // Add marker with custom icon
            .bindPopup('This is your current location')
            .openPopup()
            .addTo(map);
    };

    map.on('moveend', updateCenterMarker); // Listen for map move end event

    setInterval(() => {
        map.invalidateSize(); // Refresh map size to ensure correct centering
    }, 1000);
})();
