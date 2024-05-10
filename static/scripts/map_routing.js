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
    // FIXME: currently only detects a server running under localhost:5500
    serviceUrl: 'http://localhost:5500/route/v1',
    fitSelectedRoutes: false,
    draggableWaypoints: false,
    addWaypoints: false,
    position: 'bottomright'
});