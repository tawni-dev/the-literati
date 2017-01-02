const passport = require('passport');

module.exports = (app) => {
  app.get('/auth/facebook', passport.authenticate('facebook'));

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/#/user-authenticated',
                                        failureRedirect: '/login' }));

  app.get('/session', (req, res) => {
    if(!req.isAuthenticated()) {
      return res.status(403).send();
    }

    return res.status(200).send(req.user);
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.status(200).send();
  });
}
