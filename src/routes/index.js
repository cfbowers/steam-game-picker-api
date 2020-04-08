const router = require('express').Router();
const pp = require('../middleware/passport');
const steamCheck = require('../middleware/steamCheck');
const userHandlers = require('./handlers/userHandlers'); 
const authHandlers = require('./handlers/authHandlers'); 
const steamHandlers = require('./handlers/steamHandlers');


router.post   ('/auth/validateToken',                         authHandlers.validate);
router.post   ('/auth/login',                                 authHandlers.login);
router.post   ('/auth/logout',                                authHandlers.logout); 
router.post   ('/auth/logoutAll',                             authHandlers.logout); 

router.post   ('/users',                                      userHandlers.create);

router.get    ('/profile',                                    userHandlers.read);
router.patch  ('/profile',                                    userHandlers.update);
router.delete ('/profile',                                    userHandlers.destroy);

router.get    ('/steam/auth',         pp.setup, pp.steamAuth, authHandlers.steamLogin);
router.get    ('/steam/auth/return',  pp.setup, pp.steamAuth, authHandlers.steamLoginReturn);
router.get    ('/steam/profile',      steamCheck,             steamHandlers.getProfile);
router.get    ('/steam/friends',      steamCheck,             steamHandlers.getFriends);
router.get    ('/steam/shared-games', steamCheck,             steamHandlers.getSharedGames);


module.exports = router;