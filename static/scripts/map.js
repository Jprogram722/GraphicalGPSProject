(() => {
    let map = L.map('map').setView([44.650627, -63.597140], 14);
    let centerMarker = null;
 
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
 
    const campusMarker = L.marker([44.66941024799195, -63.61346907985597]).addTo(map)
        .bindPopup('NSCC IT Campus')
        .openPopup();
 
    const updateCenterMarker = () => {
        // Updating the marker ot the center of screen
        if (centerMarker) {
            centerMarker.setLatLng(map.getCenter());
        // The marker for the current location
        } else {
            centerMarker = L.marker(map.getCenter(), { autoPan: false })
                .bindPopup('This is your current location')
                .openPopup()
                .addTo(map);
        }
    };
 
    // Waiting for the map to move around
    map.on('moveend', updateCenterMarker);
 
    // Have it refresh the layer for the marker to move
    setInterval(() => {
        map.invalidateSize();
    }, 1000);
})();