const router = require('express').Router();
const auth = require('../middleware/auth');
const pp = require('../middleware/passport');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const profileController = require('../controllers/profileController');
const steamController = require('../controllers/steamController');
const steamAuthController = require('../controllers/steamAuthController');


router.post('/auth/login', authController.login);
router.post('/auth/validate', auth, authController.validate);
router.post('/auth/logout', auth, authController.logout);
router.post('/auth/logoutAll', auth, authController.logoutAll);

router.get('/profile', auth, profileController.get);
router.patch('/profile', auth, profileController.update);
router.delete('/profile', auth, profileController.delete);

router.get('/steam/profile', auth, steamController.getProfile);
router.get('/steam/friends', auth,  steamController.getFriends);
router.get('/steam/shared-games', auth, steamController.getSharedGames);
router.post('/steam/profile', auth, steamController.updateProfile);

router.get('/steam/auth', auth, pp.setup, pp.steamAuth, steamAuthController.get);
router.get('/steam/auth/return', auth, pp.setup, pp.steamAuth, steamAuthController.return);

router.post('/users', userController.create);


module.exports = router;