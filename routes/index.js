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

var Step = require('step')
var request = require('request');
var fs = require('fs')

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};



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


gohrouter.get('/tmp', function(req, res, next) {
  var request = require('request');
  request.post({
    headers : {
      "X-Parse-Application-Id" : "QCi6g6v8HEPYRlJ4rjt9eXbB26Rb870ZHuGDiCMc",
       "content-type" : "application/json"
     },
    url : "http://gameonhack.com:8080/parse/users",
    json : {
        authData: {
          facebook: {
            id: "10154495793537369",
            access_token: "EAAD0PxsGYQ8BAEp0GwEX8yvTZCF4FxTiLZAnY7AqCNDLUoVsmZBARYl6cZCQSZCggh7npZBz2BfsKAVRnpumRFll5ZAS3LqxgYqN8KwkbKxlJh7Q6p8tKogz9fgyLfnCgyAXVKrLXp1u59kFfVgV0x1VQJMBBZAKpncZD"
          }
        }
    }
  }, function(error, response, body){
    console.log(body);
  });
    res.gohrender('index', { title: 'Game On' });
});

gohrouter.get('/design',function(req, res, next) {
  res.gohrender('design', { title: 'Design Guideline' })
});

gohrouter.get('/signup',function(req, res, next) {
  res.gohrender('signup', { title: 'Game On', facebooklogin : dataManager.FB().getLoginUrl({ scope: 'user_about_me,email,user_likes' }) });
});


gohrouter.get('/login/callback',function(req, res, next) {
  var code            = req.query.code;

    if(req.query.error) {
        // user might have disallowed the app
        return res.send('login-error ' + req.query.error_description);
    } else if(!code) {
        return res.redirect('/');
    }

    Step(
        function exchangeCodeForAccessToken() {
            dataManager.FB().napi('oauth/access_token', {
                client_id:      dataManager.FB().FB.options('appId'),
                client_secret:  dataManager.FB().FB.options('appSecret'),
                redirect_uri:   dataManager.FB().FB.options('redirectUri'),
                code:           code
            }, this);
        },
        function extendAccessToken(err, result) {
            if(err) throw(err);
            dataManager.FB().napi('oauth/access_token', {
                client_id:          dataManager.FB().FB.options('appId'),
                client_secret:      dataManager.FB().FB.options('appSecret'),
                grant_type:         'fb_exchange_token',
                fb_exchange_token:  result.access_token
            }, this);
        },
        function (err, result) {
            if(err) return next(err);

            req.session.access_token    = result.access_token;
            req.session.expires         = result.expires || 0;

            var parameters              = { access_token : req.session.access_token };

            dataManager.FB().api('me/?fields=name,id,email', 'get', parameters, function (result) {

              if(!result || result.error) {
                return res.send(500, result || 'error');
              }

              download("https://graph.facebook.com/"+result.id+"/picture?width=600", 'google.png', function(){
                var data = new Buffer(fs.readFileSync("google.png")).toString("base64")
                var parseFile = dataManager.NewFile("image.jpg", { base64: data });
                parseFile.save().then(function() {
                  // The file has been saved to Parse.

                  var user = dataManager.NewUser();
                  user.set("username", result.id);
                  user.set("password", "mypass");
                  user.set("email", result.email);

                  var  authData = {
                    "facebook": {
                      "id": result.id,
                      "access_token": req.session.access_token,
                      "expiration_date": req.session.expires
                    }
                  }
                  user.set("authData", authData);

                  // other fields can be set just like with Parse.Object
                  user.set("name", result.name);
                  user.set("facebookId", result.id);
                  user.set("image", parseFile);

                  user.signUp(null, {
                    success: function(user) {
                      // Hooray! Let them use the app now.

                      return res.redirect('/');

                      //return res.redirect('/');
                    },
                    error: function(user, error) {
                      // Show the error message somewhere and let the user try again.
                      return res.send("Error: " + error.code + " " + error.message);
                    }
                  });


                }, function(error) {
                  // The file either could not be read, or could not be saved to Parse.
                });
              });



            });

          }
    );

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
