const bcrypt = require('bcryptjs');


const updateProfile = async (user, updates) => {
  const allowedImmediateUpdates = [ 'steamid', 'steamApiKey', 'email' ]; 

  if (user.email === 'hello@demo.com') 
    return Promise.reject({ status: 400, message: 'unable to make changes for demo profile' });  

  if (updates['password'] && await canUpdatePassword(user, updates)) 
    user.password = updates['newPassword']; 
  else if (updates['password']) return Promise.reject({ 
    status: 400, 
    message: 'password incorrect or new passwords don\'t match '
  });

  const keysToUpdate = Object.keys(updates);
  const applicableUpdates = keysToUpdate.filter((key) => allowedImmediateUpdates.includes(key)); 
  applicableUpdates.forEach((key) => user[key] = updates[key]);     
  await user.save();
};

const canUpdatePassword = async (user, { password, newPassword, confirmNewPassword }) => {
  console.log(password, newPassword, confirmNewPassword)
  const pwdMatch = await bcrypt.compare(user.password, password);
  if (!pwdMatch || (newPassword !== confirmNewPassword)) return false; 
  return true; 
};


module.exports = { updateProfile }; 