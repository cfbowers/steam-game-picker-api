const SteamStrategy = require('passport-steam').Strategy;
const d = require('debug')('steam-roulette-api:route-service:steamAuth');
const home = require('config').get('app.apiUrl');


// setuo this way so the api key could be based off of the logged in user
function steamStrategy({ token, user }) { 
  const returnURL = `${home}/steam/auth/return?token=${token}`; 
  const strategyOptions = { returnURL, realm: home, apiKey: user.steamApiKey }; 
  const cb = async (_url, response, done) => {
    const { _json: { steamid, personaname } } = response;
    d(`got steamId: ${steamid} for steam user: '${personaname}'`);
    user.steamid = steamid;
    await user.save();
    d(`applied ${steamid} to user ${user.email}`);
    done(null, response);
  }; 

  return new SteamStrategy(strategyOptions, cb);
}


module.exports = { steamStrategy };