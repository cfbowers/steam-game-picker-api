const router = require('express').Router()
const auth = require('../middleware/auth')
const passport = require('passport')
const SteamStrategy = require('passport-steam').Strategy
const steamUtil = require('../util/steam')


router.use(auth)

const home = 'http://localhost:3001/'

const steamStrategy = (user) => {
  //I set it up this way so the api key could be based off of the logged in user
  return new SteamStrategy(
    { returnURL: home + 'steam/auth/return', realm: home, apiKey: user.steamApiKey }
    , async (openIdUrl, steamProfile, done) => {
      try {
        user.steamid = steamProfile._json.steamid
        steamProfile.steamApiKey = user.steamApiKey
        await user.save()
        done(null, steamProfile)
      } catch (e) {
        done(e, null)
      }
    })
}

const passportSetup = (req, res, next) => {
  passport.use(steamStrategy(req.user))
  passport.initialize()
  next()
}

const steamAuth = passport.authenticate('steam', { failureRedirect: home, session: false } )


router.get('/', passportSetup, steamAuth, (req, res) => res.redirect(home))

router.get('/return', passportSetup, steamAuth, async (req, res) => { 
  try {
    await steamUtil.saveOrUpdateSteamUser(req.user._json, req.user.steamApiKey)
  } catch (e) {
    res.status(500).send(e)
  }
})


module.exports = router