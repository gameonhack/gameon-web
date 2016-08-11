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

var parseKeys = require('./../parsekeys');
var Step = require('step')
var request = require('request');

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(gohrouter.fs.createWriteStream(filename)).on('close', callback);
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

gohrouter.get('/design',function(req, res, next) {
  res.gohrender('design', { title: 'Design Guideline' })
});

function requestLogin(req, res, id, accessToken, nextUrl) {
  var request = require('request');
  request.post({
    headers : {
      "X-Parse-Application-Id" :  parseKeys.appId,
      "content-type" : "application/json"
    },
    url : "http://gameonhack.com:8080/parse/users",
    json : {
      authData: {
        facebook: {
          id: id,
          access_token: accessToken
        }
      }
    }
  }, function(error, response, body){

    dataManager.logInUserWithSession(body.sessionToken, function(user, error) {

      if (error == null) {
        req.session.user = user
        return res.redirect(nextUrl)

      } else {
        return res.send('Not welcome!')
      }
    })

  });
}

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


              var query = dataManager.NewUserQuery();
              query.equalTo("facebookId", result.id);
              query.find({
                success: function(object) {
                  // Do stuff
                  var facebookId = result.id

                  if (object.length == 0) {

                    var imageFile = "img"+ facebookId + ".jpg"

                    download("https://graph.facebook.com/"+facebookId+"/picture?width=600", imageFile, function(){
                      var data = new Buffer(gohrouter.fs.readFileSync( imageFile )).toString("base64")
                      var parseFile = dataManager.NewFile("image.jpg", { base64: data });
                      parseFile.save().then(function() {
                        // The file has been saved to Parse.

                        function rand(length,current){
                          current = current ? current : '';
                          return length ? rand( --length , "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".charAt( Math.floor( Math.random() * 60 ) ) + current ) : current;
                        }

                        var user = dataManager.NewUser();
                        user.set("username", facebookId);
                        user.set("password", rand(20,null) );
                        user.set("email", result.email);

                        var  authData = {
                          "facebook": {
                            "id": facebookId,
                            "access_token": req.session.access_token,
                            "expiration_date": req.session.expires
                          }
                        }
                        user.set("authData", authData);

                        // other fields can be set just like with Parse.Object
                        user.set("name", result.name);
                        user.set("facebookId", facebookId);
                        user.set("image", parseFile);

                        user.signUp(null, {
                          success: function(user) {
                            // Hooray! Let them use the app now.
                            var snames = result.name.split(" ");
                            var fname = snames[0];
                            var lname = snames[1];
                            var request = require('request');
                            if (fname == null) {
                              fname = ""
                            }
                            if (lname == null) {
                              lname = ""
                            }
                            request.post({
                              headers : {
                                "X-Parse-Application-Id" :  parseKeys.appId,
                                "content-type" : "application/json"
                              },
                              url : "http://gameonhack.us13.list-manage.com/subscribe/post?u=a74d555a0c667c17b0b501bdf&amp;id=ef3289a502",
                              form : {
                                EMAIL: result.email,
                                FNAME: fname,
                                LNAME: lname,
                                b_a74d555a0c667c17b0b501bdf_ef3289a502: "",
                              }
                            }, function(error, response, body){



                            });

                            gohrouter.fs.unlinkSync(imageFile)
                             requestLogin(req, res, facebookId, req.session.access_token, "/profile/edit")
                          },
                          error: function(user, error) {
                            console.log("NOT Hooray");
                            // Show the error message somewhere and let the user try again.
                            return res.send("Error: " + error.code + " " + error.message);
                          }
                        });


                      }, function(error) {
                        // The file either could not be read, or could not be saved to Parse.

                        return res.send("Error: " + error.code + " " + error.message);

                      });
                    });

                  } else {

                    return requestLogin(req, res, facebookId, req.session.access_token, "/profile")

                  }

                }
              });

            });


            });

});

gohrouter.get('/signup',function(req, res, next) {
  res.gohrender('signup', { title: 'Game On', facebooklogin : dataManager.FB().getLoginUrl({ scope: 'user_about_me,email,user_likes' }) });
});

gohrouter.get('/login',function(req, res, next) {
  res.gohrender('login', { title: 'Game On', facebooklogin : dataManager.FB().getLoginUrl({ scope: 'user_about_me,email,user_likes' }) })
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
