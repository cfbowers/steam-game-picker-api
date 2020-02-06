const router = require('express').Router()
const passport = require('passport')
const SteamStrategy = require('passport-steam').Strategy


const home = 'http://localhost:3001/'

const steamStrategy = (req) => {
  //I set it up this way so the api key could be based off of the logged in user
  return new SteamStrategy(
    { returnURL: `${home}steam/auth/return?token=${req.token}`, realm: home, apiKey: req.user.steamApiKey }
    , async (openIdUrl, steamProfile, done) => {
      req.user.steamid = steamProfile._json.steamid
      await req.user.save()
      done(null, steamProfile)
    })
}

const passportSetup = (req, res, next) => {
  passport.use(steamStrategy(req))
  passport.initialize()
  next()
}

const steamAuth = passport.authenticate('steam', { failureRedirect: home, session: false } )


router.get('/', passportSetup, steamAuth, (req, res) => {
  res.redirect('http://localhost:3000/profile')
})

router.get('/return', passportSetup, steamAuth, async (req, res) => { 
  try {
    await req.steamUtil.getOrNewSteamUser(req.user._json.steamid, { 
      includeAppIds: true, 
      includeFriendIds: true,
      update: true 
    })
    res.redirect('http://localhost:3000/profile')
  } catch (e) {
    res.status(500).send(e)
  }
})


module.exports = router