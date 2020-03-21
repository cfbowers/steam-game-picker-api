const mongoose = require('mongoose');
const mConfig = require('config').get('mongo');

mongoose.connect(mConfig.url, mConfig.connectionOptions);

module.exports = mongoose; 