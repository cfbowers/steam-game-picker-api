const User = require('../data/models/user');

async function logout ({ user, token = '' }, logoutAll = false) {
  user.tokens = (logoutAll)
    ? []
    : user.tokens = user.tokens.filter((t) => t.token != token);
  await user.save();
  console.log(user);
}

async function login(email, password) {
  const user = await User.findByCredentials(email, password); 
  const token = await user.generateAuthToken(); 
  return { user, token }; 
}

module.exports = { logout, login }; 