const router = require('express').Router()
const auth = require('../middleware/auth')
const passport = require('passport')
const SteamStrategy = require('passport-steam').Strategy
const SteamUser = require('../data/models/steamUser')


router.use(auth)

const home = 'http://localhost:3001/'

const steamStrategy = (user) => {
    //I set it up this way so the api key could be based off of the logged in user
    return new SteamStrategy(
        { returnURL: home + 'steam/auth/return', realm: home, apiKey: user.steamApiKey }
        , async (openIdUrl, steamProfile, done) => {
            try {
                user.steamid = steamProfile._json.steamid
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
        const steamProfileData = req.user._json
        const steamUser = await SteamUser.findOne( { steamid: steamProfileData.steamid } )
        
        if (!steamUser) {
            const steamUser = await new SteamUser(steamProfileData)
            await steamUser.save()
        } else {
            keys = Object.keys(steamProfileData)
            keys.forEach(key => steamUser[key] = steamProfileData[key])
            await steamUser.save()
        }

        res.status(200).send(steamUser)

    } catch (e) {
        res.status(500).send(e)
    }
})


module.exports = router