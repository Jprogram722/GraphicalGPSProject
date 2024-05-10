// This file is where we declare our new leaflet controls.
// https://leafletjs.com/examples/extending/extending-3-controls.html

draggingEnabled = false;
statusH2 = L.DomUtil.create("h2");
compassH2 = L.DomUtil.create("h2");
statusH2.innerHTML = "Loading...";
compassH2.innerHTML = "Loading...";

/**
 * The route select is a simple HTML dropdown list that selects from a preset list of locations found in locations.js.
 * If you want to add more locations to the dropdown, edit the JSON data inside that file.
 */
L.Control.Dropdown = L.Control.extend({
    onAdd: map => {
        var selectList = L.DomUtil.create("select");
        selectList.classList.add("leaflet-location-select")

        defaultText = L.DomUtil.create("option");
        defaultText.text = "Select a destination";
        defaultText.value = -1;
        defaultText.disabled = true;
        defaultText.hidden = true;
        selectList.appendChild(defaultText);
        selectList.value = -1;

        for (var i = 0; i < locations.length; i++) {
            var opt = L.DomUtil.create("option");
            opt.text = 
            opt.value = 
            selectList.appendChild(opt);
        }

        return selectList;
    },
    onRemove: map => {

    }
});
L.control.dropdown = function(opts) {
    return new L.Control.Dropdown(opts);
}

/**
 * This button toggles/untoggles map centering on the user marker. Helpful if you need your end user to
 * pan out the map to view their destination and stuff.
 */
L.Control.ToggleDragging = L.Control.extend({
    onAdd: map => {
        var button = L.DomUtil.create("button");
        button.classList.add("leaflet-toggle-dragging");
        button.innerHTML = createImageElement(panImg);

        button.onclick = () => {
            let buttonText = button.innerHTML;
            button.innerHTML = buttonText == createImageElement(panImg) ? createImageElement(pinImg) : createImageElement(panImg);
            if (draggingEnabled) {
                map.flyTo(currentMarker.getLatLng())
                map.dragging.disable();
            }
            else {
                map.dragging.enable();
            }
            draggingEnabled = !draggingEnabled
        };

        return button;
    }
})
L.control.toggleDragging = (opts) => {
    return new L.Control.ToggleDragging(opts);
}

/**
 * Helper function, returns an img element with the specified path as src.
 * @param {String} url
 */
const createImageElement = (url) => {
    return `<img src="${url}">`
}

/**
 * This control lists information about the current status of the user. The current position, the altitude, the current speed, etc.
 */
L.Control.DisplayStatus = L.Control.extend({
    onAdd: map => {
        var div = L.DomUtil.create("div");
        div.classList.add("leaflet-display-status");
        div.appendChild(statusH2);

        return div;
    }
})
L.control.displayStatus = (opts) => {
    return new L.Control.DisplayStatus(opts);
}

const updateStatus = (text) => {
    statusH2.innerHTML = text;
}

/**
 * This control displays the current compass direction i.e. "NW", "SE", etc.
 */
L.Control.Compass = L.Control.extend({
    onAdd: map => {
        var div = L.DomUtil.create("div");
        div.classList.add("leaflet-compass");
        div.appendChild(compassH2);

        return div;
    }
})
L.control.compass = (opts) => {
    return new L.Control.Compass(opts);
}

const updateCompass = (text) => {
    compassH2.innerHTML = text;
} 

/**
 * Button to display a modal window.
 */
L.Control.ShowModal = L.Control.extend({
    onAdd: map => {
        var button = L.DomUtil.create("button");
        button.classList.add("leaflet-show-modal");
        
        button.onclick = () => {
            toggleModal();
        }

        return button;
    }
})
L.control.showModal = (opts) => {
    return new L.Control.ShowModal(opts);
}

/**
 * Helper function, toggles the modal
 */
const toggleModal = () => {
    modal = document.querySelector("#distance-selector");
    if (modal.style.visibility === "visible") {
        modal.style.visibility = "hidden";
    }
    else {
        modal.style.visibility = "visible";
    }
}
