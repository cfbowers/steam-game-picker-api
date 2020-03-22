const User = require('../data/models/user');


async function createUser(params) {
  const user = new User(params);
  const token = await user.generateAuthToken();
  await user.save();
  return { user, token };
}


module.exports = { createUser };