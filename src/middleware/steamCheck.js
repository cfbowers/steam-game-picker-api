const { badRequest } = require('../util/errors');

function steamCheck (req, _res, next) {
  const { user: { steamApiKey, steamid } } = req; 
  let error = undefined; 

  if(steamApiKey && !steamid) error = 'no steamid associated with profile';
  if(!steamApiKey && !steamid) error = 'no steamApiKey or steamid associated with profile';

  if(error) return next(badRequest(error));

  next(); 
}


module.exports = steamCheck; 