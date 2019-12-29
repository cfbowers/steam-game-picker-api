const router = require('express').Router()
const User = require('../data/models/user') //I feel like I shouldn't need this
const auth = require('../middleware/auth')
const passport = require('passport')
const SteamStrategy = require('passport-steam').Strategy


router.use(auth)

const home = 'http://localhost:3001/'

const steamStrategy = (user) => {
    //user is the authenticated user's object
    return new SteamStrategy({ 
        returnURL: home + 'steam/auth/return', 
        realm: home, 
        apiKey: user.steamApiKey 
    }
    , async (identifier, profile, done) => {
        try {
            const user = await User.findOne( { _id: user._id } )
            console.log(user)
            // obj.steamid = profile._json.steamid
            // obj.fullSteamData = profile._json
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