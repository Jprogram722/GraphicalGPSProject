// This file is where we declare our new leaflet controls.
// https://leafletjs.com/examples/extending/extending-3-controls.html

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
            opt.text = locations[i].name;
            opt.value = locations.map(e => e.name).indexOf(locations[i].name);
            selectList.appendChild(opt);
        }

        selectList.onchange = function(){updateRoute()};

        return selectList;
    },
    onRemove: map => {

    }
});
L.control.dropdown = function(opts) {
    return new L.Control.Dropdown(opts);
}