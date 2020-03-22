const router = require('express').Router();
const User = require('../data/models/user');
const auth = require('../middleware/auth');
const success = require('../util/returnData').success;
const logout = require('../util/auth').logout; 


// authentication happens before res.send, so this only works if the user is auth'd
router.post('/validate', auth, (req, res) => res.send(success()));

router.post('/login', (req, res, next) => {
  const email = req.body.email;
  const pass = req.body.password;
  User.findByCredentials(email, pass)
    .then(async (user) => res.send(success({ user, token: await user.generateAuthToken() })))
    .catch((err) => next(err));
});

router.post('/logout', auth, async (req, res) => {
  logout({ user: req.user, token: req.token }); 
  res.send(success('logout successful'));
});

router.post('/logoutAll', auth, async (req, res) => {
  logout({ user: req.user }, true); 
  res.send(success('successfully logged out of all devices'));
});


module.exports = router;