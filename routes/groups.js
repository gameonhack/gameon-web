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
    res.gohrender('groups', { title: 'Groups', groups :  results });
  } )
});


gohrouter.get('/:id', function(req, res, next) {

  dataManager.findGroups({"objectId" : req.params.id}, function (results) {

    res.gohrender('groups', { title: 'Groups', groups :  results });
  } )

});


module.exports = gohrouter.router;
