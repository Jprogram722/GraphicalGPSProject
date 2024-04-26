let server = window.location;

(async () => {

    const customIcon = L.icon({
        iconUrl: '/static/images/user.png',
        iconSize: [75, 75], 
        iconAnchor: [36, 60], 
        popupAnchor: [0, -16] 
    });

    let map = L.map('map');
    map.setView([44.650627, -63.597140], 16)
    let currentMarker = L.marker(map.getCenter(), { icon: customIcon, autoPan: false }).addTo(map); // Add marker with custom icon;
    let previousMaker = L.marker(map.getCenter());

    // fetching sample data
    setInterval(async () => {
        let res = await fetch('/api/test-data');
        let data = await res.json();
        console.log(data);
    }, 5000);

    var layer = protomapsL.leafletLayer({url: `${server}/api/maps/north_halifax.pmtiles`, theme:'light'});
    layer.addTo(map);

    // L.tileLayer('../static/maps/{z}/{x}/{y}.png', {
    //     maxZoom: 19,
    //     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    // }).addTo(map);

    const campusMarker = L.marker([44.66941024799195, -63.61346907985597]).addTo(map)
        .bindPopup('NSCC IT Campus')
        .openPopup();

    const updateMarker = () => {
        previousMaker.setLatLng(new L.LatLng(currentMarker._latlng.lat, currentMarker._latlng.lng));
        currentMarker.setLatLng(map.getCenter()); // Update marker position to the new center
        // Calculate new bearing
        let deltaLat = currentMarker._latlng.lat - previousMaker._latlng.lat;
        let deltaLng = currentMarker._latlng.lng - previousMaker._latlng.lng;
        let currentBearing = Math.atan(deltaLng / deltaLat) * (180 / Math.PI);
        if (deltaLat < 0) {
            currentBearing += 180;
        }
        currentMarker.setRotationAngle(currentBearing);
    };

    map.on('moveend', updateMarker); // Listen for map move end event

    setInterval(() => {
        map.invalidateSize(); // Refresh map size to ensure correct centering
    }, 1000);
    
})();
