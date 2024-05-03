const apiKey = 'api_key';
$(function() {
    L.control.weather({
        apiKey
    }).addTo(map);
});