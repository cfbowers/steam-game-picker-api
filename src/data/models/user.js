const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { badRequest } = require('../../util/errors');


const allowedExternalUpdates = [ 'steamid', 'steamApiKey', 'email' ]; 

const userSchema = mongoose.Schema({
  steamid: { type: String, index: true, default: '' }, 
  steamApiKey: { type: String, default: '' }, 
  password: { type: String, required: true }, 
  email: { type: String, index: true, required: true, unique: true, validate: (value) => {
    if (!validator.isEmail(value)) return badRequest(`${value} is not a valid email address`);
  } }, 
  tokens: [{ token: { type: String, required: true }  }]
});

userSchema.methods.generateAuthToken = async function() {
  const token = jwt.sign({ _id: this.id }, 'jwttotrot');
  this.tokens.push({ token });
  await this.save();
  return token;
};

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  user.tokens = undefined;
  user.password = undefined;
  user.__v = undefined;
  return user;
};

userSchema.methods.updatePassword = async function (currentPass, newPass, confirmNewPass) {
  if (!(newPass && confirmNewPass)) 
    return badRequest('new password and new password confirmation required');

  if (newPass !== confirmNewPass) 
    return badRequest('new password and new password confirmation must match');

  if (!(await bcrypt.compare(currentPass, this.password))) 
    return badRequest('incorrect password');
  
  this.password = newPass; 
  return this.save(); 
};

userSchema.statics.findByCredentials = async function (email, password) {
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) return user;
  else return badRequest('unable to find user with the provided email/password combo');
};

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 8);
  next();
});

const User = mongoose.model('User', userSchema);


module.exports = { User, allowedExternalUpdates };