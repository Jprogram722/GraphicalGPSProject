// This file is where we declare our new leaflet controls.
// https://leafletjs.com/examples/extending/extending-3-controls.html

draggingEnabled = false;

/**
 * This button toggles/untoggles map centering on the user marker. Helpful if you need your end user to
 * pan out the map to view their destination and stuff.
 */
L.Control.ToggleDragging = L.Control.extend({
    onAdd: map => {
        var button = L.DomUtil.create("button");
        button.classList.add("leaflet-toggle-dragging");
        button.innerHTML = createImageElement(panImg);

        button.onclick = function(){
            let buttonText = button.innerHTML;
            button.innerHTML = buttonText == createImageElement(panImg) ? createImageElement(pinImg) : createImageElement(panImg);
            toggleDragging();
        };

        return button;
    }
})
L.control.toggleDragging = (opts) => {
    return new L.Control.ToggleDragging(opts);
}

/**
 * Toggle centering. If enabled, the map will only zoom into the center and prevent map panning. If not, then those
 * things will be enabled
 */
const toggleDragging = () => {
    if (draggingEnabled) {
        map.flyTo(currentMarker.getLatLng())
        map.dragging.disable();
    }
    else {
        map.dragging.enable();
    }
    draggingEnabled = !draggingEnabled
}

/**
 * Helper function, returns an img element with the specified path as src.
 * @param {String} url
 */
const createImageElement = (url) => {
    return `<img src="${url}">`
}