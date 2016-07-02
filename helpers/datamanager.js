/**
* @Author: Eduardo Irías <eduardo22i>
<<<<<<< HEAD
* @Date:   2016-06-01T14:54:46-06:00
* @Project: GOHackathon
* @Last modified by:   eduardoirias
* @Last modified time: 2016-06-07T15:53:33-06:00
=======
* @Date:   2016-05-26T02:04:04-06:00
* @Project: GOHackathon
* @Last modified by:   eduardo22i
* @Last modified time: 2016-05-31T18:33:40-06:00
>>>>>>> master
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
  findGroupsOrderBy : function (where, ascending, sortkey, callback) {
    var Group = Parse.Object.extend("Group");

    var query = new Parse.Query(Group);

    var key;
    for (key in where) {
      query.equalTo(key, where[key] )
    }

    if (ascending) {
      query.ascending(sortkey)
    } else {
      query.descending(sortkey)
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


  findEventsOrderBy : function (where, ascending, sortkey, callback) {
    var Event = Parse.Object.extend("Event");

    var query = new Parse.Query(Event);

    var key;
    for (key in where) {
      query.equalTo(key, where[key] )
    }

    if (ascending) {
      query.ascending(sortkey)
    } else {
      query.descending(sortkey)
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
  },

  findSchedulesOrderBy : function (where, ascending, sortkey, callback) {
    var Event = Parse.Object.extend("Schedule");
    var query = new Parse.Query(Event);
    var key;
    for (key in where) {
      query.equalTo(key, where[key] )
    }

    if (ascending) {
      query.ascending(sortkey)
    } else {
      query.descending(sortkey)
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


  findSchedules : function (where, callback) {
    module.exports.findSchedulesOrderBy(where, false, "createdAt", callback)
  },


  getSchedules : function (callback) {
    module.exports.findSchedules({}, callback)
  },

  findGamesOrderBy : function (where, ascending, key, callback) {
    var Game = Parse.Object.extend("Game");

    var query = new Parse.Query(Game);

    var key;
    for (key in where) {
      query.equalTo(key, where[key] )
    }

    if (ascending) {
      query.ascending(key)
    } else {
      query.descending(key)
    }
    query.include("group");
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

  findGames : function (where, callback) {
    module.exports.findGamesOrderBy(where, false, "createdAt", callback)
  },

  getGames : function (callback) {
    module.exports.findGames({}, callback)
  },

  findGameDownloadsOrderBy : function (where, ascending, key, callback) {
    var GameDownload = Parse.Object.extend("GameDownload");

    var query = new Parse.Query(GameDownload);

    var key;
    for (key in where) {
      query.equalTo(key, where[key] )
    }

    if (ascending) {
      query.ascending(key)
    } else {
      query.descending(key)
    }
    query.include("console");
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
  findGameDownloads : function (where, callback) {
    module.exports.findGameDownloadsOrderBy(where, false, "createdAt", callback)
  },
  getGameDownloads : function (callback) {
    module.exports.findGameDownloads({}, callback)
  },
  findSpeakersOrderBy : function (where, ascending, sortkey, callback) {
    var Speaker = Parse.Object.extend("Speaker");

    var query = new Parse.Query(Speaker);

    var key;
    for (key in where) {
      query.equalTo(key, where[key] )
    }

    if (ascending) {
      query.ascending(sortkey)
    } else {
      query.descending(sortkey)
    }
    query.include("schedule");
    query.include("user");
    query.include("user.group");

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
  findSpeakers : function (where, callback) {
    module.exports.findSpeakersOrderBy(where, false, "createdAt", callback)
  },
  getSpeakers : function (callback) {
    module.exports.findSpeakers({}, callback)
  }
}
