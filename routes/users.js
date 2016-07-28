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
  if (req.session.user == null) {
    res.gohrender('login', { title: 'Game On' })
  } else {

    dataManager.user(req, function(user) {
      console.log(user);
      req.session.user = user
      res.gohrender('profile', { title: 'Game On', user : user });
    })

  }
});

module.exports = gohrouter.router;
