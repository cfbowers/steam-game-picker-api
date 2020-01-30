//Router for getting and modifying the logged in user's profile
const router = require('express').Router()
const auth = require('../middleware/auth')
const bcrypt = require('bcryptjs')

router.use(auth)

router.get('/', async (req, res) => {
  try {
    res.send(req.user)
  } catch (e) {
    res.status(500).send({ error: e.message })
  }
})

router.patch('/', async (req, res) => {
  try {
    if (req.user.email === 'demo@demo.com')
      throw new Error ('you cannot make changes for the demo profile')

    const updatedParams = Object.keys(req.body)

    if (updatedParams.includes('password')) {
      const currentPasswordMatch = await bcrypt.compare(req.body.password, req.user.password)

      if (!currentPasswordMatch)
        throw new Error('current password value was not correct')

      if (!(req.body['newPassword'] === req.body['confirmNewPassword']))
        throw new Error('new password values did not match')

      req.user.password = req.body['newPassword']
    } else {
      updatedParams.forEach(param => req.user[param] = req.body[param])
    }

    await req.user.save()
    res.send(req.user)
  } catch (e) {
    res.status(500).send({ error: e.message })
  }
})

router.delete('/', async (req, res) => {
  try {
    await req.user.remove()
    res.send({ success: 'successfully deleted profile', deletedUser: req.user})
  } catch (e) {
    res.status(500).send({ error: e.message })
  }
})

module.exports = router