/**
* @Author: Eduardo Irías <eduardo22i>
* @Date:   2016-05-31T12:04:33-06:00
* @Project: GOHackathon
* @Last modified by:   eduardoirias
* @Last modified time: 2016-06-05T21:31:15-06:00
*/



var express = require('express');
module.exports.router = {}


module.exports = {
  shouldLoadLayout : function (req) {
    var query = require('url').parse(req.url,true).query;
    return query.shouldloadlayout == undefined ? true : query.shouldloadlayout;
  },

  get : function (page, callback) {
    module.exports.router.get(page, function(req, res, next) {

      res.gohrender = function (page, object) {
        object.shouldLoadLayout = module.exports.shouldLoadLayout(req)
        if (req.session.user) {
          object.user = req.session.user;
        }
        res.render(page, object);
      }
      callback(req, res, next)
    });
  }

}
