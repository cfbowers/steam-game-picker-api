const router = require('express').Router();
const pp = require('../middleware/passport');
const { commonHandler, redirectHandler } = require('../routes/handlers/higherOrder');
const userHandlers = require('./handlers/userHandlers'); 
const authHandlers = require('./handlers/authHandlers'); 
const steamHandlers = require('./handlers/steamHandlers');


router.post   ('/users', commonHandler(userHandlers.create));

router.post   ('/auth/validateToken', commonHandler(authHandlers.validate));
router.post   ('/auth/login', commonHandler(authHandlers.login));
router.post   ('/auth/logout', commonHandler(authHandlers.logout)); 
router.post   ('/auth/logoutAll', commonHandler(authHandlers.logout)); 

router.get    ('/profile', commonHandler(userHandlers.read));
router.patch  ('/profile', commonHandler(userHandlers.update));
router.delete ('/profile', commonHandler(userHandlers.destroy));

router.get    ('/steam/auth',        pp.setup, pp.steamAuth, redirectHandler(authHandlers.steamLogin));
router.get    ('/steam/auth/return', pp.setup, pp.steamAuth, redirectHandler(authHandlers.steamReturn));
router.get    ('/steam/profile',      commonHandler(steamHandlers.getProfile));
router.get    ('/steam/friends',      commonHandler(steamHandlers.getFriends));
router.get    ('/steam/shared-games', commonHandler(steamHandlers.getSharedGames));
router.post   ('/steam/profile',      commonHandler(steamHandlers.updateProfile));


module.exports = router;