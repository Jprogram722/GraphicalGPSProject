// This file is where we declare our new leaflet controls.
// https://leafletjs.com/examples/extending/extending-3-controls.html

draggingEnabled = false;
statusH2 = L.DomUtil.create("h2");
compassH2 = L.DomUtil.create("h2");
statusH2.innerHTML = "Loading...";
compassH2.innerHTML = "Loading...";

const modals = document.querySelectorAll(".modal");

let isVisable = false;

/**
 * The route select is a simple HTML dropdown list that selects from a preset list of locations found in locations.js.
 * If you want to add more locations to the dropdown, edit the JSON data inside that file.
 */
L.Control.Dropdown = L.Control.extend({
    onAdd: map => {
        var container = L.DomUtil.create("div");
        container.classList.add("leaflet-locations")

        var selectList = L.DomUtil.create("select");
        selectList.classList.add("leaflet-locations-select")

        defaultText = L.DomUtil.create("option");
        defaultText.text = "Select a destination";
        defaultText.value = -1;
        defaultText.disabled = true;
        defaultText.hidden = true;
        selectList.appendChild(defaultText);
        selectList.value = -1;
        getLocationsData(selectList)
        selectList.onchange = () => {
            // don't do anything without a valid value
            if (selectList.value !== -1) {
                updateRoute(selectList.value.split(','))
            }
        }

        var button = L.DomUtil.create("button");
        button.innerText = "Save Location";
        button.onclick = () => {
            toggleModal('location-name-selector')
        }

        container.appendChild(button);
        container.appendChild(selectList);
        return container;
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
        button.innerHTML = createImageElement(statsImg)
        
        button.onclick = () => {
            toggleModal('distance-selector');
            getDistanceData();
        }

        return button;
    }
})
L.control.showModal = (opts) => {
    return new L.Control.ShowModal(opts);
}




/**
 * Fetch the locations JSON array from the API and populate the select list
 * @param {HTMLElement} selectList
 */
const getLocationsData = async (selectList) => {
    selectList.value = "-1";
    // clear the entire select list
    while (selectList.options.length > 1) {
        selectList.remove(1);
    }
    const res = await fetch("/api/get-locations");
    await res.json()
    .then(data => {
        for (var i = 0; i < data.length; i++) {
            var opt = L.DomUtil.create("option");
            opt.text = data[i].Name
            opt.value = `${data[i].Latitude},${data[i].Longitude}`
            selectList.appendChild(opt);
        }
    });
}

/**
 * Returns an img element with the specified path as src.
 * @param {String} url
 */
const createImageElement = (url) => {
    return `<img src="${url}">`
}

/**
 * Turn a modal on/off.
 * @param {String} modal
 */
const toggleModal = (modal) => {
    let modalContainer = document.querySelector(`#${modal}`)
    if (modalContainer.style.display === "flex") {
        modalContainer.style.display = "none";
    }
    else {
        modalContainer.style.display = "flex";
    }
}

modals.forEach((modal) => {
    modal.addEventListener("click", () => {
        modal.style.display = "none";
    });
});