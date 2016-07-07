/**
* @Date:   2016-05-31T19:31:56-06:00
* @Last modified time: 2016-06-01T17:08:50-06:00
*/



var express = require('express');
var _ = require('lodash');

var dataManager = require('datamanager');
var gohrouter = require('gohrouter');

gohrouter.router = express.Router();

/* GET home page. */
gohrouter.get('/', function(req, res, next) {
  dataManager.findEventsOrderBy({}, true, "date", function (results) {
    res.gohrender('events', { title: 'Eventos', events :  results });
  } )
});


gohrouter.get('/:id', function(req, res, next) {
  dataManager.findEvents({"objectId" : req.params.id}, function (results) {
    var event = results[0];
    dataManager.findSchedulesOrderBy({"event" : event}, true, "date",  function (schedulesResults) {
      var groupedByMonth = _.groupBy(schedulesResults, function(item) {
        var d = item.get("date")
        var nd = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
        return  nd;
      });
      console.log(groupedByMonth);
      res.gohrender('event', { title: 'Eventos', event : event, schedules : groupedByMonth });
    })
  })
});

gohrouter.get('/:id/schedule/:scheduleid/', function(req, res, next) {
  dataManager.findSchedules({"objectId" : req.params.scheduleid}, function (results) {
    var schedule = results[0]
    dataManager.findSpeakers({"schedule" : schedule}, function (results) {
      res.gohrender('schedule', { title: 'Horario', schedule : schedule, speakers : results });
    })
  })
});

module.exports = gohrouter.router;
