/**
* @Date:   2016-05-31T19:31:56-06:00
* @Last modified time: 2016-06-01T17:08:50-06:00
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
    var event = results[0];
    dataManager.findSchedules({"event" : event}, function (results) {
      res.gohrender('event', { title: 'Events', event : event, schedules : results });
    })
  })

});


module.exports = gohrouter.router;
