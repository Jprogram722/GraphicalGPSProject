let server = window.location;
const locationDisplay = document.querySelector("#location h1");
const compassDisplay = document.querySelector("#compass h1");

(async () => {

    const customIcon = L.icon({
        iconUrl: '/static/images/user.png',
        iconSize: [75, 75], 
        iconAnchor: [36, 60], 
        popupAnchor: [0, -16] 
    });

    let map = L.map('map', { zoomControl: false });
    map.setView([44.650627, -63.597140], 16)
    let currentMarker = L.marker(map.getCenter(), { icon: customIcon, autoPan: false }).addTo(map); // Add marker with custom icon;
    let previousMaker = L.marker(map.getCenter());

    // fetching arduino data
    setInterval(async () => {
        let res = await fetch('/api/test-data');
        let data = await res.json();
        console.log(data);

        if(data.Status === "Success"){
            map.setView([data.Latitude, data.Longitude], 14);
            updateMarker([data.Latitude, data.Longitude]);
        }
        // Map overlay
        compassDisplay.innerHTML = "TEST"
        locationDisplay.innerHTML = "TEST12345"
    }, 5000);

    var layer = protomapsL.leafletLayer({url: `${server}/api/maps/north_halifax.pmtiles`, theme:'light'});
    layer.addTo(map);

    const campusMarker = L.marker([44.66941024799195, -63.61346907985597]).addTo(map)
        .bindPopup('NSCC IT Campus')
        .openPopup();

    const updateMarker = (coordinates) => {
        previousMaker.setLatLng(new L.LatLng(currentMarker._latlng.lat, currentMarker._latlng.lng));
        currentMarker.setLatLng(new L.LatLng(coordinates[0], coordinates[1])); // Update marker position to the new center
        // Calculate new bearing
        let deltaLat = currentMarker._latlng.lat - previousMaker._latlng.lat;
        let deltaLng = currentMarker._latlng.lng - previousMaker._latlng.lng;
        let currentBearing = Math.atan(deltaLng / deltaLat) * (180 / Math.PI);
        if (deltaLat < 0) {
            currentBearing += 180;
        }
        currentMarker.setRotationAngle(currentBearing);
    };

    setInterval(() => {
        map.invalidateSize(); // Refresh map size to ensure correct centering
    }, 1000);
    
})();
