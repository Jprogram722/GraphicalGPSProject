(async () => {

    // Define a custom icon using the 'user.png' image
    const customIcon = L.icon({
        iconUrl: '../static/images/user.png',
        iconSize: [75, 75], 
        iconAnchor: [36, 60], 
        popupAnchor: [0, -16] 
    });

    let map = L.map('map');

    // Set initial view and add current marker with custom icon
    map.setView([44.650627, -63.597140], 14)
    let currentMarker = L.marker(map.getCenter(), { icon: customIcon, autoPan: false }).addTo(map); // Add marker with custom icon;
    let previousMaker = L.marker(map.getCenter());

    // popup icon for the user's locaiton
    currentMarker.bindPopup('Your current location')

    
    // Fetching sample data
    setInterval(async () => {
        try {
            let res = await fetch('/api/test-data');
            let data = await res.json();
            console.log(data);

            if (data.Status === "Success") {
                map.setView([data.Latitude, data.Longitude], 14);
                updateMarker([data.Latitude, data.Longitude]);
            }
        // Error handling for fetching the data 
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, 5000);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    
    }).addTo(map);

    L.grid({
        redraw: 'moveend'
    }).addTo(map);

    const campusMarker = L.marker([44.66941024799195, -63.61346907985597]).addTo(map)
        .bindPopup('NSCC IT Campus')
        .openPopup();

    const updateMarker = (corrdinates) => {
        previousMaker.setLatLng(new L.LatLng(currentMarker._latlng.lat, currentMarker._latlng.lng));
        currentMarker.setLatLng(new L.LatLng(corrdinates[0], corrdinates[1])); // Update marker position to the new center

        let deltaLat = currentMarker._latlng.lat - previousMaker._latlng.lat;
        let deltaLng = currentMarker._latlng.lng - previousMaker._latlng.lng;
        let currentBearing = Math.atan(deltaLng / deltaLat) * (180 / Math.PI);
        if (deltaLat < 0) {
            currentBearing += 180;
        }

        currentMarker.setRotationAngle(currentBearing);
    };

    // map.on('moveend', updateMarker); // Listen for map move end event

    setInterval(() => {
        map.invalidateSize(); // Refresh map size to ensure correct centering
    }, 1000);
})();
