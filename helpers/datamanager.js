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
  },


  findEventsOrderBy : function (where, ascending, key, callback) {
    var Event = Parse.Object.extend("Event");

    var query = new Parse.Query(Event);

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


  findEvents : function (where, callback) {
    module.exports.findEventsOrderBy(where, false, "createdAt", callback)
  },


  getEvents : function (callback) {
    module.exports.findEvents({}, callback)
  }



}
