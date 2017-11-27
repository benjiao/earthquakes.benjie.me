var defaultMarker = L.icon({
    iconUrl: '/static/images/marker-icon.png',
    shadowUrl: '/static/images/marker-shadow.png'
})

window.MainMap = {
    map: null,
    earthquakeFeatureGroup: null,

    init: function() {
        this.map = L.map('main-map').setView([12.5, 121], 3);

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18,
            minZoom: 3,
        }).addTo(this.map);
    },

    setEarthquakeFeatures: function(data) {
    }
}


function refreshData(callback) {
    var url = "http://gs.benjie.me/geoserver/GmE205/ows";
    
    // Build CQL query
    filters = [
        'date IS NOT NULL'
    ];

    var params = {
        service: "WFS",
        version: "1.0.0",
        request: "GetFeature",
        typeName: "GmE205:earthquake",
        outputFormat: "application/json",
        sortBy: "date"
    }

    if (filters.length > 0) {
        params['CQL_FILTER'] = filters.join(" AND ")
    }


    console.log(params);

    $.get(url, params, function(res){
        $('#count-div').text(res.totalFeatures);
        MainMap.setEarthquakeFeatures(res);

        console.log(res.features);
        callback();
    });
}

$('#filter-form').on('submit', function(e){
    e.preventDefault();
    refreshData();
});

$(function() {
    MainMap.init();
    MainMap.earthquakesLayerGroup = L.layerGroup();
    refreshData(function(){
        $('#loading-div').removeClass('active');
    });
})