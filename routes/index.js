var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Earthquake Cluster Map' });
});

router.get('/timeline', function(req, res, next) {
  res.render('timeline', { title: 'Earthquake Timeline' });
});

module.exports = router;
