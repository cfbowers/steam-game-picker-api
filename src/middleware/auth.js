const { User } = require('../data/models/user');
const jwt = require('jsonwebtoken');
const SteamUtil = require('../util/classes/SteamUtil');
const { badRequest, unauthorized } = require('../util/errors');


async function authenticate (req, _res, next) {
  if (req.method === 'POST' && [ '/users', '/auth/login' ].includes(req.url)) 
    return next();

  const tokenInHeader = req.header('Authorization'); 
  const tokenInQuery = req.query.token; 
  
  if (!tokenInHeader && !tokenInQuery) 
    return next(badRequest('no token supplied'));

  const token = (tokenInHeader) ? tokenInHeader.replace('Bearer ', '') : tokenInQuery;
  const decodedToken = jwt.verify(token, 'jwttotrot');
  const user = await User.findOne({ _id: decodedToken._id, 'tokens.token': token });
  
  if (!user) return next(unauthorized());

  req.user = user;
  req.token = token;
  req.steamUtil = (user.steamApiKey) ? new SteamUtil(user.steamApiKey) : undefined;
  next();    
}


module.exports = authenticate; 