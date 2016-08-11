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


gohrouter.router.post('/edit',  gohrouter.upload.single('photo'), function(req, res) {

  console.log(req.file);

  dataManager.Parse().User.enableUnsafeCurrentUser()
  dataManager.Parse().User.become(req.session.user.sessionToken).then(function (user) {
    // The current user is now set to user.

    user.set("name", req.body.name)
    user.set("username", req.body.user)
    user.set("bio", req.body.bio)

    if (req.file != null) {

      var data = new Buffer( gohrouter.fs.readFileSync( req.file.path ) ).toString("base64")
      var parseFile = dataManager.NewFile("image.jpg", { base64: data });

      parseFile.save().then(function() {
        // The file has been saved to Parse.

        user.set("image", parseFile);
        user.save(null, {
          success: function(savedUser) {

            gohrouter.fs.unlinkSync(req.file.path)
            req.session.user = savedUser
            res.redirect("/profile")

          }
        })

      }, function(error) {
        // The file either could not be read, or could not be saved to Parse.

        return res.send("Error: " + error.code + " " + error.message);

      });

    } else {

      user.save(null, {
        success: function(savedUser) {

          req.session.user = savedUser
          res.redirect("/profile")

        }
      })

    }


  }, function (error) {

    console.log(error);

    res.send("/?shouldloadlayout=false")

  });

});


/* GET users listing. */
gohrouter.get('/', function(req, res, next) {
  if (req.session.user == null) {
    res.gohrender('login', { title: 'Game On', facebooklogin : dataManager.FB().getLoginUrl({ scope: 'user_about_me,email,user_likes' }) })
  } else {

    dataManager.user(req, function(user) {
      req.session.user = user
      res.gohrender('profile/profile', { title: 'Game On', userView : user, isCurrent : true });
    })

  }
});

gohrouter.get('/edit', function(req, res, next) {
  if (req.session.user == null) {
    res.gohrender('login', { title: 'Game On', facebooklogin : dataManager.FB().getLoginUrl({ scope: 'user_about_me,email,user_likes' }) })
  } else {

    dataManager.user(req, function(user) {
      req.session.user = user
      res.gohrender('profile/edit', { title: 'Game On', userView : user });
    })

  }
});

gohrouter.get('/:id', function(req, res, next) {

  var query = dataManager.NewUserQuery();
  query.equalTo("username", req.params.id);
  query.find({
    success: function(users) {

      if (users.length == 0) {
        return res.send("user not found")
      }
      var user = users[0]
      var isCurrent = req.session.user.objectId == user.id
      res.gohrender('profile/profile', { title: 'Game On', userView : user, isCurrent : isCurrent });

    }
  })

});

module.exports = gohrouter.router;


module.exports.findUsers = function (req, res, notFoundCallback) {
  res.gohrender = function (page, object) {
    var query = require('url').parse(req.url,true).query;
    object.shouldLoadLayout = query.shouldloadlayout == undefined ? true : query.shouldloadlayout;

    if (req.session.user) {
      object.user = req.session.user;
    }
    res.render(page, object);
  }

  var user = req._parsedOriginalUrl.pathname.substring(1)
  console.log(user);
  var query = dataManager.NewUserQuery();
  query.equalTo("username", user);
  query.find({
    success: function(users) {

      if (users.length == 0) {
        return notFoundCallback()
      }
      var user = users[0]
      var isCurrent = req.session.user.objectId == user.id
      res.gohrender('profile/profile', { title: 'Game On', userView : user, isCurrent : isCurrent });

    }
  })
}
