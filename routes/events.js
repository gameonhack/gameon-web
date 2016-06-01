/**
* @Date:   2016-05-31T19:31:56-06:00
* @Last modified time: 2016-05-31T20:20:33-06:00
*/



var express = require('express');

var dataManager = require('datamanager');
var gohrouter = require('gohrouter');
gohrouter.router = express.Router();

/* GET home page. */
gohrouter.get('/', function(req, res, next) {
  dataManager.getEvents(function (results) {
    res.gohrender('events', { title: 'Events', events :  results });
  } )
});


gohrouter.get('/:id', function(req, res, next) {

  dataManager.findEvents({"objectId" : req.params.id}, function (results) {

    res.gohrender('events', { title: 'Events', events :  results });
  } )

});


module.exports = gohrouter.router;
