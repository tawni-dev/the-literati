const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const config = require('./config');

module.exports = (app) => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    const db = app.get('db');

    db.users.find(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use(new FacebookStrategy({
    clientID: config.FACEBOOK_APP_ID,
    clientSecret: config.FACEBOOK_APP_SECRET,
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'email', 'picture']
  }, (accessToken, refreshToken, profile, done) => {
    const db = app.get('db');

    db.users.where(`facebook_id=$1`, [profile.id], (err, users) => {
      if(err) {
        return done(err);
      }

      if(users.length > 0) {
        return done(null, users[0]);
      }

      db.users.insert({
        facebook_id: profile.id,
        display_name: profile.displayName,
        token: accessToken,
        email: profile._json.email,
        photo_url: profile._json.picture.data.url
      }, (err, res) => {
        if(err) {
          return done(err);
        }

        return done(null, res);
      });
    });
  }));
};
