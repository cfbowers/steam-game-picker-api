const router = require('express').Router();
const createUser = require('../routeServices/user').createUser; 
const success = require('../util/returnData').success;

router.post('/', (req, res, next) => {
  createUser(req.body)
    .then((result) => res.send(success(result)))
    .catch((err) => next(err));
});


module.exports = router;