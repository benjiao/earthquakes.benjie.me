var markerRenderer = L.svg({
    padding: 0.5,
    className: "earthquake-marker"
});

window.MainMap = {
    map: null,
    earthquakeFeatureGroup: null,
    earthquakes: [],

    init: function() {
        this.map = L.map('main-map').setView([0, 0], 3);

        L.tileLayer('https://api.mapbox.com/styles/v1/benjiao/cjajhjxxdavog2qmf1fgqwtzw/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYmVuamlhbyIsImEiOiJjaWc4NXl0c3MwMGZ4dWhtNXBrc2V6YjhuIn0.8y1VtL2RJZ3wi8Aam6cG8Q', {
            attribution: " © <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
            maxZoom: 18,
            minZoom: 0,
        }).addTo(this.map);


    },

    showDecade = function(decade) {
        var self = this;

        try {
            self.map.removeLayer(self.earthquakeFeatureGroup);
        } catch (e) {
        }

        self.earthquakeFeatureGroup = L.layerGroup();

        _.each(self.earthquakes[decade], function(d){

            console.log(d);
            var marker = L.circle(d, {
                renderer: markerRenderer
            });

            self.earthquakeFeatureGroup.addLayer(marker);
        });

        self.map.addLayer(self.earthquakeFeatureGroup);
    }
}


function fetchData(callback) {
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
          var decade = parseInt(year / 10);
          features_by_year[decade] = features_by_year[decade] || [];

          if(row.geometry) {
              features_by_year[decade].push([
                row.geometry.coordinates[1],
                row.geometry.coordinates[0]
              ]);
          }
      });

      callback(features_by_year);
    });
}

$(function(){
    // Initialize Basemap
    MainMap.init();

    // Load data from Geoserver
    fetchData(function(data){
        console.log(data);
        $('#loading-div').removeClass('active');
        MainMap.earthquakes = data;
    });

    // Initialize Date Slider
    $('#date-selector').range({
        min: 3,
        max: 201,
        start: 3,
        onChange: function(value) {
          $('#date-header').html("Year " + (value * 10) + " - " + ((value + 1) * 10) + " AD") ;
          MainMap.showDecade(value);
        }
      });
})