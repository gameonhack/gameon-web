/**
* @Author: Eduardo Irías <eduardo22i>
* @Date:   2016-05-26T02:04:04-06:00
* @Project: GOHackathon
* @Last modified by:   eduardo22i
* @Last modified time: 2016-05-31T18:33:40-06:00
*/



var Parse = require('parse/node');

module.exports = {

  /**
   * anonymous function - description
   *
   * @param  {Object}   where     description
   * @param  {Boolean}  ascending description
   * @param  {String}   key       description
   * @param  {Function} callback  description
   * @return {type}               description
   */
  findGroupsOrderBy : function (where, ascending, key, callback) {
    var Group = Parse.Object.extend("Group");

    var query = new Parse.Query(Group);

    var key;
    for (key in where) {
      query.equalTo(key, where[key] )
    }

    if (ascending) {
      query.ascending(key)
    } else {
      query.descending(key)
    }

    query.find({
      success: function(results) {
        console.log("Successfully retrieved " + results.length + " objects.");
        // Do something with the returned Parse.Object values
        callback(results)
      },
      error: function(error) {
        console.log("Error: " + error.code + " " + error.message);
      }
    });
  },


  /**
   * anonymous function - description
   *
   * @param  {type} where    description
   * @param  {type} callback description
   * @return {type}          description
   */
  findGroups : function (where, callback) {
    module.exports.findGroupsOrderBy(where, false, "createdAt", callback)
  },


  /**
   * anonymous function - description
   *
   * @param  {type} callback description
   * @return {type}          description
   */
  getGroups : function (callback) {
    module.exports.findGroups({}, callback)
  }
}
