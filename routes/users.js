/**
* @Author: Eduardo Irías <eduardo22i>
* @Date:   2016-05-20T15:12:29-06:00
* @Project: GOHackathon
* @Last modified by:   eduardo22i
* @Last modified time: 2016-05-31T18:06:54-06:00
*/



var express = require('express');
var dataManager = require('datamanager');
var gohrouter = require('gohrouter');
gohrouter.router = express.Router();

/* GET users listing. */
gohrouter.get('/', function(req, res, next) {
  console.log(dataManager.user());
  if (req.session.user == null) {
    res.redirect("/login?shouldloadlayout=false")
  } else {
    res.send(req.session.user);
  }
});

module.exports = gohrouter.router;
