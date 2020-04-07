const SteamStrategy = require('passport-steam').Strategy;
const d = require('debug')('steam-roulette-api:controllers:steamAuth');
const passport = require('passport');
const home = require('config').get('app.apiUrl');


const setup = function (req, _res, next) {
  passport.use(steamStrategy(req));
  passport.initialize();
  next();
};

const steamAuth = passport.authenticate('steam', { failureRedirect: home, session: false });


// setup this way so the api key could be based off of the logged in user
function steamStrategy({ token, user }) { 
  const returnURL = `${home}/steam/auth/return?token=${token}`; 
  const strategyOptions = { returnURL, realm: home, apiKey: user.steamApiKey }; 
  const cb = async (_url, response, done) => {
    const { _json: { steamid, personaname } } = response;
    d(`got steamId: ${steamid} for steam user: '${personaname}'`);
    user.steamid = steamid;
    await user.save();
    d(`applied steamId: ${steamid} to app user: '${user.email}'`);
    done(null, response);
  }; 

  return new SteamStrategy(strategyOptions, cb);
}

module.exports = { steamAuth, setup }; 