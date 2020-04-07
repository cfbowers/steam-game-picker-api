const { error } = require('jsend');

module.exports = function (err, _req, res, _next) {
  if (err.error) err = err.error; // look for errors coming from /utils/errors
  const message = (typeof err === 'string') ? err : err.message; 
  const status = (err.status && typeof err.status === 'number') ? err.status : 500; 
  res.status(status).send(error(message)); 
}