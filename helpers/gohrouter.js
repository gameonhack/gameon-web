var express = require('express');
//var router = express.Router();
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
        res.render(page, object);
      }

      callback(req, res, next)
    });
  }

}
