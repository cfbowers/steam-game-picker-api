const { success } = require('jsend'); 

// these are used to wrap all handlers to prevent reuse of then/catch -- keeping it DRY! 
function commonHandler (fn) {
  return function (req, res, next) {
    fn(req, res, next)
      .then((data) => res.send(success(data)))
      .catch((err) => next(err)); 
  };
}

function redirectHandler (fn) {
  return function (req, res, next) {
    fn(req, res, next)
      .then((url) => res.redirect(url))
      .catch((err) => next(err));
  }; 
}

module.exports = { commonHandler, redirectHandler }; 