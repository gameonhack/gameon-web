/**
* @Author: Eduardo Irías <eduardo22i>
* @Date:   2016-05-30T18:14:13-06:00
* @Project: GOHackathon
* @Last modified by:   eduardo22i
* @Last modified time: 2016-05-31T18:35:40-06:00
*/



require('app-module-path').addPath(__dirname + '/helpers');
var Parse = require('parse/node');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('client-sessions');

var routes = require('./routes/index');
var users = require('./routes/users');
var groups = require('./routes/groups');
var events = require('./routes/events');
var games = require('./routes/games');


var parseKeys = require('./parsekeys');

Parse.initialize(parseKeys.appId, parseKeys.jsKey);
Parse.serverURL = parseKeys.serverURL;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Session
app.use(session({
  cookieName: 'session',
  secret: 'keyboard cat',
  duration: 31 * 24 * 60 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}))

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/profile', users);
app.use('/groups', groups);
app.use('/events', events);
app.use('/games', games);

// catch 404 and forward to error handler
app.use(function(req, res, next) {

  users.findUsers (req, res, function() {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  })
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    var query = require('url').parse(req.url,true).query;
    var shouldloadlayout = query.shouldloadlayout == undefined ? true : query.shouldloadlayout;
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      shouldLoadLayout: shouldloadlayout,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  var query = require('url').parse(req.url,true).query;
  var shouldloadlayout = query.shouldloadlayout == undefined ? true : query.shouldloadlayout;
  res.render('error', {
    message: err.message,
    shouldLoadLayout: shouldloadlayout,
    error: {}
  });
});


module.exports = app;
