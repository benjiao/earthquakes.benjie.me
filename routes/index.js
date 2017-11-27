var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Earthquake Cluster Map' });
});

router.get('/heatmap', function(req, res, next) {
  res.render('heatmap', { title: 'Earthquake Heatmap' });
});

router.get('/timelapse', function(req, res, next) {
  res.render('timelapse', { title: 'Earthquake Timelapse' });
});

module.exports = router;
