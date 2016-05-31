var express = require('express');
var router = express.Router();

var dataManager = require('datamanager');


/* GET home page. */
router.get('/', function(req, res, next) {
  dataManager.getGroups(function (results) {

    res.render('index', { title: 'Express', groups :  results });
  } )

});

router.get('/design', function(req, res, next) {

  res.render('design', { title: 'Design Guideline' });

});

module.exports = router;
