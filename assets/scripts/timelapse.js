var defaultMarker = L.icon({
    iconUrl: '/static/images/marker-icon.png',
    shadowUrl: '/static/images/marker-shadow.png'
})

window.MainMap = {
    map: null,
    earthquakeFeatureGroup: null,

    init: function() {
        this.map = L.map('main-map').setView([0, 90], 1);

        L.tileLayer('https://api.mapbox.com/v4/mapbox.dark/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYmVuamlhbyIsImEiOiJjaWc4NXl0c3MwMGZ4dWhtNXBrc2V6YjhuIn0.8y1VtL2RJZ3wi8Aam6cG8Q', {
            attribution: " © <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
            maxZoom: 18,
            minZoom: 3,
        }).addTo(this.map);
    },

    setEarthquakeFeatures: function(features){
        self = this;

        _.map(features, function(d){
            var heat = L.heatLayer(d, {
                radius: 25
            }).addTo(self.map);
        });
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

    $.get(url, params, function(res){
        var features_by_year = {};

        _.map(res.features, function(row){
            var year = row.properties.year;
            features_by_year[year] = features_by_year[year] || [];

            if(row.geometry) {
                features_by_year[year].push([
                    row.geometry.coordinates[0],
                    row.geometry.coordinates[1],
                    0.25]);
            }
        });

        callback(features_by_year);
    });
}

$(function() {
    MainMap.init();
    MainMap.earthquakesLayerGroup = L.layerGroup();

    refreshData(function(features){
        $('#loading-div').removeClass('active');
        console.log(features);
        MainMap.setEarthquakeFeatures(features);
    });

})