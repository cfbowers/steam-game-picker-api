const router = require('express').Router()
const auth = require('../middleware/auth')
const SteamUtil = require('../util/SteamUtil')


router.use(auth)

//Every time this is hit the user, their friends and appIds are updated. 
//May need to revist this
router.get('/profile', async (req, res) => {
  try {
    const steamUtil = new SteamUtil(req.user.steamApiKey)
    const user = await steamUtil.saveOrUpdateSteamUser(
      req.user.steamid, { 
        includeAppIds: true, 
        includeFriendIds: true,
        includeFriendDetails: {
          includeAppIds: true,
          includeFriendIds: false
        }
      })
    res.status(200).send(user)
  } catch (e) {
    res.status(500).send(e)
  }
})

router.get('/shared-apps', async (req, res) => {
  try {
    //With no query params it should should show shared apps with individual friends 
    //e.g. { friend: 'steamID', sharedApps: [1,2,3] }
    //With steamIDs query param it should show just the shared appIDs between the logged in user and the steamIDs provided 
  } catch (e) {
    res.status(500).send(e)
  }
})


module.exports = router
