// This file is where we declare our new leaflet controls.
// https://leafletjs.com/examples/extending/extending-3-controls.html

/**
 * This button toggles/untoggles map centering on the user marker. Helpful if you need your end user to
 * pan out the map to view their destination and stuff.
 */
L.Control.ToggleDragging = L.Control.extend({
    onAdd: map => {
        var button = L.DomUtil.create("button");
        button.classList.add("leaflet-toggle-dragging");
        button.textContent = "Toggle Dragging";

        button.onclick = function(){toggleDragging()};

        return button;
    }
})
L.control.toggleDragging = function(opts) {
    return new L.Control.ToggleDragging(opts);
}