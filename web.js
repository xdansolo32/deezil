var async   = require('async');
var express = require('express');
var util    = require('util');

//mongoose and schema setup, can delete later if we roll something else
// check console for user object identification test when running web.js
var mongoose = require('mongoose');

var MONGO_DB = process.env.MONGO_DB || 'mongodb://localhost/test';
mongoose.connect(MONGO_DB);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'FUCKING connection error:'));
db.once('open', function callback () {
  console.log('FUCK YEAH!!!');
});

var userSchema = mongoose.Schema({
	firstName: String,
	lastName: String,
	email: String,
	age: Number,
	birthday: Date,
	isFag: Boolean
});

var transactionSchema = mongoose.Schema({
	//hostHash
	//arrayOfLenders
	maturityDate: Date
})

userSchema.methods.displayStats = function() {
	var fn = this.firstName,
	ln = this.lastName,
	email = this.email,
	age = this.age,
	birthday = this.birthday,
	amFag = this.isFag;
	console.log("THIS ARE AM THE MONGOOZ DATABASE YOOZIR SKEEMA TESTING AREA!!!! \n")
	console.log("HI, MY NAME IS " + fn + " " + ln);
	console.log("I am " + age + ", and my birthday is " + birthday);
	console.log("If you are wondering and a guy, my interest in you is: " + amFag);
}

var User = mongoose.model('User', userSchema);
var daniel = new User({firstName: 'daniel', lastName: 'sun', email:'daniel@sun.com',
	age: 28, birthday: new Date(2013, 02, 20, 1, 1, 1, 1), isFag: false});
	
daniel.displayStats();	



// create an express webserver
var app = express.createServer(
  express.logger(),
  //express.static(__dirname + '/public'),
  express.static('./Diesel'),
  express.bodyParser(),
  express.cookieParser(),
  // set this to a secret value to encrypt session cookies
  express.session({ secret: process.env.SESSION_SECRET || 'secret123' }),
  require('faceplate').middleware({
    app_id: process.env.FACEBOOK_APP_ID,
    secret: process.env.FACEBOOK_SECRET,
    scope:  'user_likes,user_photos,user_photo_video_tags'
  })
);

// listen to the PORT given to us in the environment
var port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("Listening on " + port);
});

app.dynamicHelpers({
  'host': function(req, res) {
    return req.headers['host'];
  },
  'scheme': function(req, res) {
    req.headers['x-forwarded-proto'] || 'http'
  },
  'url': function(req, res) {
    return function(path) {
      return app.dynamicViewHelpers.scheme(req, res) + app.dynamicViewHelpers.url_no_scheme(path);
    }
  },
  'url_no_scheme': function(req, res) {
    return function(path) {
      return '://' + app.dynamicViewHelpers.host(req, res) + path;
    }
  },
});

function render_page(req, res) {
  req.facebook.app(function(app) {
    req.facebook.me(function(user) {
      res.render('index.ejs', {
        layout:    false,
        req:       req,
        app:       app,
        user:      user
      });
    });
  });
}

function handle_facebook_request(req, res) {

  // if the user is logged in
  if (req.facebook.token) {
	  /*  // WE should do the below to clean up our JS and make debugging easier
	  async.parallel({
		  getMahFriends: function(cb) {
		  	
		  }
	  })
	  */
    async.parallel([
      function(cb) {
        // query 4 friends and send them to the socket for this socket id
        req.facebook.get('/me/friends', { limit: 4 }, function(friends) {
          req.friends = friends;
          cb();
        });
      },
      function(cb) {
        // query 16 photos and send them to the socket for this socket id
        req.facebook.get('/me/photos', { limit: 16 }, function(photos) {
          req.photos = photos;
          cb();
        });
      },
      function(cb) {
        // query 4 likes and send them to the socket for this socket id
        req.facebook.get('/me/likes', { limit: 4 }, function(likes) {
          req.likes = likes;
          cb();
        });
      },
      function(cb) {
        // use fql to get a list of my friends that are using this app
        req.facebook.fql('SELECT uid, name, is_app_user, pic_square FROM user WHERE uid in (SELECT uid2 FROM friend WHERE uid1 = me()) AND is_app_user = 1', function(result) {
          req.friends_using_app = result;
          cb();
        });
      }
    ], function() {
      render_page(req, res);
    });

  } else {
    render_page(req, res);
  }
}

app.get('/', handle_facebook_request);
app.post('/', handle_facebook_request);
