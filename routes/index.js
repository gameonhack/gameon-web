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
      req.session.user = user
      res.redirect("/")

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

gohrouter.get('/logout',function(req, res, next) {

  dataManager.Parse().User.enableUnsafeCurrentUser()
  dataManager.Parse().User.become(req.session.user.sessionToken).then(function (user) {
    // The current user is now set to user.
    dataManager.Parse().User.logOut().then(() => {
      req.session.user = null
      res.redirect("/?shouldloadlayout=false")
    });

  }, function (error) {
    // The token could not be validated.
    console.log(error);
    req.session.user = null
    res.redirect("/?shouldloadlayout=false")

  });

});


module.exports = gohrouter.router;
