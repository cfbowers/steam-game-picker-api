const error = require('../util/returnData').error; 

module.exports = function (err, req, res, next) {
  let status = 500; 
  let message = (typeof err === 'string') ? err : err.message;
  if (err.status) status = err.status; 
  res.status(status).send(error(message)); 
};
