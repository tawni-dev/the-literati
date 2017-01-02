const express = require('express');
const bodyParser = require('body-parser');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const path = require('path');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const config = require('./config');
const massive = require('massive');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cookieParser());

app.use(session({
  secret: config.secret,
  saveUninitialized: false,
  resave: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "../public")));

/////////////
// DATABASE //
/////////////

const conn = massive.connectSync({connectionString : "postgres://postgres:cracka@localhost/the-literati"});

const db = app.get('db');

app.set('db', conn);

/**
 * Local Auth
 */
passport.use('local', new LocalStrategy(
  function(username, password, done) {
    db.users.findOne({username: username}, function(err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (user.password != password) { return done(null, false); }
      return done(null, user);
    });
  }
));

passport.use(new FacebookStrategy({
    clientID: config.FACEBOOK_APP_ID,
    clientSecret: config.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  (accessToken, refreshToken, profile, done) => {
    console.log(profile);
    db.findUserByToken(accessToken, (err, res) => {
      console.log(res);
      if (err) { return done(err); }
      if (res.length >= 1) {
        done(null, user);
      }
      else {
        db.create_user([accessToken, profile.displayName, profile.email], function(err, res){
          console.log(err);
          console.log(res);
        done(null, res);

        });
      }
    });
  }
));

passport.serializeUser(function(user, done) {
  return done(null, user);
});

passport.deserializeUser(function(user, done) {
  return done(null, user);
});

app.post('/auth/local', passport.authenticate('local'), function(req, res) {
  res.status(200).redirect('/#/');
});


app.get('/auth/facebook', passport.authenticate('facebook'));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`server is listening on ${port}`);
});
