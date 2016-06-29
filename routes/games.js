var express = require('express');

var dataManager = require('datamanager');
var gohrouter = require('gohrouter');
gohrouter.router = express.Router();

gohrouter.get('/', function(req, res, next) {
  dataManager.getGames(function (results) {
    res.gohrender('games', { title: 'Games', games :  results });
  } )
});


gohrouter.get('/:id', function(req, res, next) {
    dataManager.findGames({"objectId" : req.params.id}, function (results) {
      var game = results[0];
      res.gohrender('game', { title: 'Games', game : game });
    } )
});

module.exports = gohrouter.router;
