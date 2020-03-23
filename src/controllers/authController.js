const User = require('../data/models/user');
const success = require('../util/helpers/jSendData').success;


exports.validate = (req, res) => res.send(success()); 

exports.login = (req, res, next) => {
  login(req.body.email, req.body.password)
    .then((data) => res.send(success(data)))
    .catch((err) => next(err));
};

exports.logout = async (req, res) => {
  await logout({ user: req.user, token: req.token }); 
  res.send(success('logout successful'));
};

exports.logoutAll = async (req, res) => {
  await logout({ user: req.user }, true); 
  res.send(success('successfully logged out of all devices'));
}; 

async function login(email, password) {
  const user = await User.findByCredentials(email, password); 
  const token = await user.generateAuthToken(); 
  return { user, token }; 
}

async function logout ({ user, token = '' }, logoutAll = false) {
  user.tokens = (!logoutAll) ? user.tokens = user.tokens.filter((t) => t.token != token) : [];
  await user.save();
  console.log(user);
}
