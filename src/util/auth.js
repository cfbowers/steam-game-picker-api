
async function logout ({ user, token = '' }, logoutAll = false) {
  user.tokens = (logoutAll)
    ? []
    : user.tokens = user.tokens.filter((t) => t.token != token);
  await user.save();
  console.log(user);
}


module.exports = { logout }; 