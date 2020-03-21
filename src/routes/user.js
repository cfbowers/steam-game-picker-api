//router for creating users
//i'll add delete capabilities for admins in the future

const router = require('express').Router();
const User = require('../data/models/user');

router.post('/', async (req, res) => {
  try {
    const user = new User(req.body);
    const token = await user.generateAuthToken();
    await user.save();
    res.send({ user, token });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});


module.exports = router;