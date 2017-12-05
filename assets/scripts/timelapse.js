window.earthquake_data = [];

var width = $("#map").width()

var mapRatio = .5
var height = width * mapRatio;

var map = d3.select("#map");

var projection = d3.geoEquirectangular();

projection.scale(width / 2 / Math.PI)
projection.translate([width / 2, height / 2])

var path = d3.geoPath().projection(projection);
var graticule = d3.geoGraticule().step([10, 10]);


function fetchEarthquakeData(callback){
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
                row.geometry.coordinates[0],
                row.geometry.coordinates[1]
              ]);
          }
      });

      callback(features_by_year);
    });
}


function showDecade(decade) {
  map.selectAll("circle").remove();

  // Add Circles
  map.selectAll("circles")
      .data(window.earthquake_data[decade]).enter()
      .append("circle")
      .attr("cx", function (d) { return projection(d)[0]; })
      .attr("cy", function (d) { return projection(d)[1]; })
      .attr("r", "1.5px")
      .attr("fill", "#F14C38");
}

function startTimelapse(){

  var display_offset = 0;
  Object.keys(window.earthquake_data).forEach(function(decade) {

      setTimeout(function(){
        showDecade(decade);
        display_offset += 300;
      }, 300 + display_offset);

  });
}


$(function(){

  // Graticule lines
   map.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);

  // Country boarders
  var url = "/static/data/tm-world-borders.json";

  d3.json(url, function(err, geojson) {
    map.append("path")
      .attr("d", path(geojson))
      .attr("class", "boundary")

    // Earthquake Data
    fetchEarthquakeData(function(data){

      window.earthquake_data = data;
      $('#loading-div').removeClass('active');
      startTimelapse();
    });

  });
});