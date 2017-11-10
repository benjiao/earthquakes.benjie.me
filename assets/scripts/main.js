var defaultMarker = L.icon({
    iconUrl: '/static/images/marker-icon.png',
    shadowUrl: '/static/images/marker-shadow.png'
})

window.DataHandler = {
    data: [],
    filters: {
        bbox: []
    },

    fetchData: function(callback){
        var self = this;

        // TODO: Replace with actual webservice
        $.get("https://raw.githubusercontent.com/benjiao/significant-earthquakes/master/earthquakes.csv", function(res){
            var parsedData = Papa.parse(res, {
                header: true,
            }).data;

            var geoJsonData = _.map(parsedData, function(item) {

                try {
                    var geometry = wellknown.parse(item.location);
                } catch (e){
                    var location = null;
                }

                return {
                    type: "Feature",
                    geometry: geometry,
                    properties: {
                        "name": item.name,
                        "date": item.year
                    }
                };
            });

            // Removes null (we do not need items without geometry)
            geoJsonData = _.filter(geoJsonData, function(n) {
                return n.geometry != null;
            })

            self.data = geoJsonData;
            callback(geoJsonData);
        });
    }
};

// A container for all my map elements
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

        self.earthquakeFeatureGroup = L.markerClusterGroup();

        _.each(data, function(d){
            var marker = L.marker(
                [d.geometry.coordinates[1], d.geometry.coordinates[0]],
                {
                    icon: defaultMarker
                }
            );

            marker.bindPopup(d.properties.name + " (" + d.properties.date + ")");
            self.earthquakeFeatureGroup.addLayer(marker);
        });

        self.map.addLayer(self.earthquakeFeatureGroup);

    }
}

$(function() {
    MainMap.init();
    MainMap.earthquakesLayerGroup = L.layerGroup();

    DataHandler.fetchData(function(earthquakes) {
        MainMap.setEarthquakeFeatures(earthquakes);
    })
})