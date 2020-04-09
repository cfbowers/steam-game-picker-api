const { error } = require('jsend');

module.exports = function (err, _req, res, _next) {
  if (err.error) 
    err = err.error; // look for errors coming from /utils/errors

  const status = (err.status && typeof err.status === 'number') 
    ? err.status 
    : 500; 
    
  let details = (typeof err === 'string') 
    ? err 
    : err.message; 

  if(process.env.DEBUG && err.stack) 
    details = { message: details, stack: err.stack }; 

  res.status(status).send(error(details)); 
}