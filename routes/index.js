var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Historical Earthquakes - Main Menu' });
});

/* GET home page. */
router.get('/clusters', function(req, res, next) {
  res.render('clusters', { title: 'Historical Earthquakes - Cluster Map' });
});

router.get('/heatmap', function(req, res, next) {
  res.render('heatmap', { title: 'Historical Earthquakes - Heatmap' });
});

router.get('/timelapse', function(req, res, next) {
  res.render('timelapse-leaflet', { title: 'Historical Earthquakes - Timelapse' });
});

module.exports = router;
