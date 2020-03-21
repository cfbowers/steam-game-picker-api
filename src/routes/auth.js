const router = require('express').Router();
const User = require('../data/models/user');
const auth = require('../middleware/auth');


router.post('/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.generateAuthToken();
    res.send({ status: 'success', data: { user, token } });
  } catch (e) { res.status(400).send({ status: 'fail', data: e.message }); }
});

router.post('/validate', auth, async (req, res) => {
  try { res.status(200).send({ tokenValid: true }); } catch (e) { res.status(400).send({ error: e.message }); }
});

router.post('/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => token.token != req.token);
    await req.user.save();
    res.send({ status: 'success', data: 'logout successful' });
  } catch (e) { res.status(400).send({ error: e.message }); }
});

router.post('/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) { res.status(400).send({ error: e.message }); }
});

module.exports = router;