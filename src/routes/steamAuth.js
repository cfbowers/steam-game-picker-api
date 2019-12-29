const router = require('express').Router()
const auth = require('../middleware/auth')
const passport = require('passport')
const SteamStrategy = require('passport-steam').Strategy


router.use(auth)

const home = 'http://localhost:3001/'

const steamStrategy = (user) => {
    //user is the authenticated user's object
    //I set it up this way so the api key could be based off of the logged in user
    return new SteamStrategy({ 
        returnURL: home + 'steam/auth/return', 
        realm: home, 
        apiKey: user.steamApiKey 
    }
    , async (identifier, profile, done) => {
        try {
            user.steamid = profile._json.steamid
            await user.save()
            return done()
        } catch (e) {
            console.log(e)
            return done()
        }
    }
)}

const passportSetup = (req, res, next) => {
    //req.user is coming from the auth middleware that the router is using
    passport.use(steamStrategy(req.user))
    passport.initialize()
    next()
}

const steamAuth = passport.authenticate('steam', { failureRedirect: home } )


router.get('/', passportSetup, steamAuth, (req, res) => res.redirect(home) )
router.get('/return', passportSetup, steamAuth, (req, res) => res.redirect(home) )


module.exports = router