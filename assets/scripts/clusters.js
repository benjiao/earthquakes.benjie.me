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

        // Accepts array of GeoJSON features
        var self = this;


        try {
            self.map.removeLayer(self.earthquakeFeatureGroup);
        } catch (e) {
        }

        self.earthquakeFeatureGroup = L.markerClusterGroup();

        _.each(data.features, function(d){
            if (d.geometry != null) {
                var marker = L.marker(
                    [d.geometry.coordinates[1], d.geometry.coordinates[0]],
                    {
                        icon: defaultMarker
                    }
                );

                marker.bindPopup(
                    "<b>" + d.properties.name +
                    "</b> <br />(" + d.properties.date +
                    ")<br /><br /> Magnitude: " + d.properties.magnitude +
                    "<br /> Intensity: " + d.properties.intensity);
                self.earthquakeFeatureGroup.addLayer(marker);
            }
        });

        self.map.addLayer(self.earthquakeFeatureGroup);
    }
}


function refreshData(callback) {
    var url = "http://gs.benjie.me/geoserver/GmE205/ows";
    
    // Build CQL query
    filters = [
        'date IS NOT NULL'
    ];

    if ($("#filter-magnitude-min").val()) {
        filters.push("magnitude > " + $("#filter-magnitude-min").val());
    }

    if ($("#filter-magnitude-max").val()) {
        filters.push("magnitude < " + $("#filter-magnitude-max").val());
    }

    if ($("#filter-intensity-min").val()) {
        filters.push("intensity > " + $("#filter-intensity-min").val());
    }

    if ($("#filter-intensity-max").val()) {
        filters.push("intensity < " + $("#filter-intensity-max").val());
    }

    var params = {
        service: "WFS",
        version: "1.0.0",
        request: "GetFeature",
        typeName: "GmE205:earthquake",
        outputFormat: "application/json",
    }

    if (filters.length > 0) {
        params['CQL_FILTER'] = filters.join(" AND ")
    }


    console.log(params);

    $.get(url, params, function(res){
        $('#count-div').text(res.totalFeatures);
        MainMap.setEarthquakeFeatures(res);

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