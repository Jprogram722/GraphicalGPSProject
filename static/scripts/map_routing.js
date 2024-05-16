// create a coordinates array for the destination
let destinationCoords;

/** 
 * Update the current route's line and itinerary (e.g. marker moved or a different destination was selected)
 * @param {Array} destination
 */
const updateRoute = (destination) => {
    destinationCoords = destination;
    waypoints = [
        currentMarker.getLatLng(),
        L.latLng(destination)
    ];
    if (waypoints[0].lat !== waypoints[1].lat || waypoints[0].lng !== waypoints[1].lng) {
        mapRouting.setWaypoints(waypoints);
        mapRouting.route();
    }
}

// create the routing functionality
const mapRouting =  L.Routing.control({
    serviceUrl: 'http://localhost:5500/route/v1',
    fitSelectedRoutes: false,
    draggableWaypoints: false,
    addWaypoints: false,
    position: 'bottomright'
});

document.querySelector('#location-save-button').addEventListener("click", async () => {
    locationName = document.querySelector('#location-save-name').value;
    if(locationName === ""){
        const validationMsg = document.querySelector('#validation-msg');
        validationMsg.textContent = "Please Enter A Name Or Press The Background To Close";
        setTimeout(() => {
            validationMsg.textContent = "";
        }, 2000);
    }
    else{
        let res = await fetch(
            "/api/insert-location", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"location_name": locationName, "latitude": destinationCoords.lat, "longitude": destinationCoords.lng})
            }
        );
        res = await res.json();
        toggleModal('location-name-selector');
        toggleKeyboard();
        // refresh the select list
        selectList = document.querySelector('.leaflet-locations-select');
        getLocationsData(selectList);
        console.log(res);
    }
}); 

document.querySelector('#confirm-btn').addEventListener("click", () => {
    resetDB();
    window.location.reload();
});


document.querySelector('#deny-btn').addEventListener("click", () => {
    toggleModal("reset-confirm");
});
