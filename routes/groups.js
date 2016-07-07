/**
* @Author: Eduardo Irías <eduardo22i>
* @Date:   2016-05-30T18:14:13-06:00
* @Project: GOHackathon
* @Last modified by:   eduardo22i
* @Last modified time: 2016-05-31T18:06:32-06:00
*/



var express = require('express');

var dataManager = require('datamanager');
var gohrouter = require('gohrouter');
gohrouter.router = express.Router();

/* GET home page. */
gohrouter.get('/', function(req, res, next) {
  dataManager.getGroups(function (results) {
    res.gohrender('groups', { title: 'Grupos', groups :  results });
  } )
});

gohrouter.get('/:id', function(req, res, next) {
  dataManager.findGroups({"objectId" : req.params.id}, function (results) {
    var group = results[0];
    dataManager.findGames({"group" : group}, function (results) {
      res.gohrender('group', { title: 'Grupo', group :  group, games : results });
    })
  })
});

gohrouter.get('/:id/game/:gameid/', function(req, res, next) {
  dataManager.findGames({"objectId" : req.params.gameid}, function (results) {
    var game = results[0];
    dataManager.findGameDownloads({"game" : game}, function (results) {
      res.gohrender('gamedownload', { title: 'Downloads', game : game, gamedownloads : results });
    })
  })
});

module.exports = gohrouter.router;
