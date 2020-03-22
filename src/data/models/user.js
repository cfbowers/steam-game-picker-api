const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const userSchema = mongoose.Schema({
  steamid: { type: String, index: true, default: '' }, 
  steamApiKey: { type: String, default: '' }, 
  password: { type: String, required: true }, 
  email: { type: String, index: true, required: true, unique: true, validate: (value) => {
    if (!validator.isEmail(value)) throw new Error(`${value} is not a valid email address`);
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

userSchema.statics.findByCredentials = async (email, password) => {
  const genericError = 'wrong username or password';
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) return user;
  else throw new Error(genericError);
};

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 8);
  next();
});

const User = mongoose.model('User', userSchema);


module.exports = User;