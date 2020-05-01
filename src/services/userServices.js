const { User, allowedExternalUpdates } = require('../data/models/user');


async function createUser(params) {
  const user = new User(params);
  const token = await user.generateAuthToken();
  await user.save();
  return { user, token };
}

async function login (email, password) {
  const user = await User.findByCredentials(email, password);
  if (user.error) return Promise.reject(user.error);
  const token = await user.generateAuthToken(); 
  return { user, token }; 
}

async function logout (user, token, logoutAll = false) {
  user.tokens = (logoutAll) ? [] : user.tokens.filter((t) => t.token != token);
  await user.save();
  const baseMsg = 'successfully logged out ' + user.email; 
  return (logoutAll) ? baseMsg + ' from all devices' : baseMsg; 
}

async function updateUser (user, updates) {
  if (user.email === 'hello@demo.com') return Promise.reject('cannot make updates to demo user'); 
  if ('password' in updates) { 
    const { password, newPassword, confirmNewPassword } = updates; 
    const result = await user.updatePassword(password, newPassword, confirmNewPassword);
    if (result.error) return Promise.reject(result.error); 
  }

  allowedExternalUpdates.forEach((key) => { if (updates[key]) user[key] = updates[key]; });
  return user.save();
}


module.exports = { createUser, login, logout, updateUser }; 