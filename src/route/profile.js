const router = require('express').Router();
const auth = require('../middleware/auth');
const profile = require('../route-services/profile');
const success = require('../util/helpers/jSendData').success; 

router.use(auth);

router.get('/', (req, res) => res.send(success(req.user)));

router.patch('/', (req, res, next) => {
  profile.updateProfile(req.user, req.body)
    .then(() => res.send(success(req.user)))
    .catch((err) => next(err));
});

router.delete('/', async (req, res) => {
  await req.user.remove();
  res.send(success({ deletedUser: req.user }));
});


module.exports = router;