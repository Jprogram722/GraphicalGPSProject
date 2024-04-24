(() => {

    const mainApp = async () => {
        let map = L.map('map');
        map.setView([44.650627, -63.597140], 14)
        let centerMarker = null; // Define the marker variable
        
        // fetching sample data
        setInterval(async () => {
            let res = await fetch('/api/test-data');
            let data = await res.json();
            console.log(data);
            
            if(data.status === "Success"){
                map.setView([data.Latitude, data.Longitude], 14);
            }
        }, 5000);

        // Define a custom icon using the 'user.png' image
        const customIcon = L.icon({
            iconUrl: '../static/user.png',
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
                centerMarker.setLatLng(map.getCenter()); // Update marker position to the new center
            } else {
                centerMarker = L.marker(map.getCenter(), { icon: customIcon, autoPan: false }) // Add marker with custom icon
                    .bindPopup('This is your current location')
                    .openPopup()
                    .addTo(map);
            }
        };

        map.on('moveend', updateCenterMarker); // Listen for map move end event

        setInterval(() => {
            map.invalidateSize(); // Refresh map size to ensure correct centering
        }, 1000);
    }

    mainApp();
})();
