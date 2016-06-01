var express = require('express');

var dataManager = require('datamanager');
var gohrouter = require('gohrouter');
gohrouter.router = express.Router();

/* GET home page. */
gohrouter.get('/', function(req, res, next) {
  dataManager.getEvents(function (results) {
    res.gohrender('events', { title: 'events', events :  results });
  } )
});


gohrouter.get('/:id', function(req, res, next) {

  dataManager.findEvents({"objectId" : req.params.id}, function (results) {

    res.gohrender('events', { title: 'Events', events :  results });
  } )

});


module.exports = gohrouter.router;
