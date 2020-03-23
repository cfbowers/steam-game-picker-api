const router = require('express').Router();
const auth = require('../middleware/auth');
const success = require('../util/helpers/jSendData').success;
const authService = require('../route-services/auth'); 


// authentication happens before res.send, so this only works if the user is auth'd
router.post('/validate', auth, (req, res) => res.send(success()));

router.post('/login', (req, res, next) => {
  authService.login(req.body.email, req.body.password)
    .then((data) => res.send(success(data)))
    .catch((err) => next(err));
});

router.post('/logout', auth, async (req, res) => {
  await authService.logout({ user: req.user, token: req.token }); 
  res.send(success('logout successful'));
});

router.post('/logoutAll', auth, async (req, res) => {
  await authService.logout({ user: req.user }, true); 
  res.send(success('successfully logged out of all devices'));
});


module.exports = router;