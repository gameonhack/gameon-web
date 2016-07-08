/**
* @Author: Eduardo Irías <eduardo22i>
* @Date:   2016-05-20T15:12:29-06:00
* @Project: GOHackathon
* @Last modified by:   eduardo22i
* @Last modified time: 2016-05-31T18:06:42-06:00
*/



var express = require('express');

var dataManager = require('datamanager');
var gohrouter = require('gohrouter');
gohrouter.router = express.Router();

/* GET home page. */
gohrouter.get('/', function(req, res, next) {
  res.gohrender('index', { title: 'Game On' });
});

gohrouter.get('/design',function(req, res, next) {
  res.gohrender('design', { title: 'Design Guideline' })
});

module.exports = gohrouter.router;
