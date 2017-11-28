var width = 960;
var height = 500;

var svg = d3.select("svg")

var projection = d3.geoEquirectangular()
  .scale(width / 2 / Math.PI)
  .translate([width / 2, height / 2])

var path = d3.geoPath()
  .projection(projection);

var graticule = d3.geoGraticule()
    .step([10, 10]);

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
          features_by_year[year] = features_by_year[year] || [];

          if(row.geometry) {
              features_by_year[year].push([
                row.geometry.coordinates[0],
                row.geometry.coordinates[1]
              ]);
          }
      });

      callback(features_by_year);
    });
}

$(function(){

  // Graticule lines
   svg.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);

  // Country boarders
  var url = "/static/data/tm-world-borders.geojson";
  d3.json(url, function(err, geojson) {
    svg.append("path")
      .attr("d", path(geojson))
      .attr("class", "boundary")

    // Earthquake Data
    fetchEarthquakeData(function(data){

      $('#loading-div').removeClass('active');

      var display_offset = 0;

      Object.keys(data).forEach(function(year) {
          setTimeout(function(){
            d3.selectAll("svg text").text(year);
            
            // svg.selectAll("circle").remove();

            // Add Circles
            svg.selectAll("circles")
              .data(data[year]).enter()
              .append("circle")
              .attr("cx", function (d) { return projection(d)[0]; })
              .attr("cy", function (d) { return projection(d)[1]; })
              .attr("r", "1.5px")
              .attr("fill", "#F14C38")
          }, 10 + display_offset);

          display_offset += 10;
      });
    });

  });
});