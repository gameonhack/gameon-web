/**
* @Author: Eduardo Irías <eduardo22i>
* @Date:   2016-05-20T15:12:29-06:00
* @Project: GOHackathon
* @Last modified by:   eduardo22i
* @Last modified time: 2016-05-31T18:06:42-06:00
*/



var express = require('express');
var session = require('client-sessions');

var dataManager = require('datamanager');
var gohrouter = require('gohrouter');
gohrouter.router = express.Router();

gohrouter.router.post('/login', function(req, res) {
  dataManager.logInUser(req.body.user, req.body.pass, function(user, error) {
    if (error == null) {

      req.session.user = user;

      res.redirect("/")

      //res.send('welcome!')


    } else {
      res.send('Not welcome!')
    }
  })

});

/* GET home page. */
gohrouter.get('/', function(req, res, next) {
  res.gohrender('index', { title: 'Game On' });
});

gohrouter.get('/design',function(req, res, next) {
  res.gohrender('design', { title: 'Design Guideline' })
});

gohrouter.get('/login',function(req, res, next) {
  res.gohrender('login', { title: 'Game On' })
});

module.exports = gohrouter.router;
