const passport = require('passport');
const steamStrategy = require('../route-service/steamAuth').steamStrategy;
const home = require('config').get('app.apiUrl');


const steamAuth = passport.authenticate('steam', { failureRedirect: home, session: false });

function setup (req, res, next) {
  passport.use(steamStrategy(req));
  passport.initialize();
  next();
}

module.exports = { setup, steamAuth };