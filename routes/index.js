var express = require('express');

var dataManager = require('datamanager');
var gohrouter = require('gohrouter');
gohrouter.router = express.Router();

/* GET home page. */
gohrouter.get('/', function(req, res, next) {
  res.gohrender('index', { title: 'Game On! Hackathon' });
});

gohrouter.get('/design',function(req, res, next) {
  res.gohrender('design', { title: 'Design Guideline' })
});

module.exports = gohrouter.router;
