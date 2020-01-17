const router = require('express').Router()
const auth = require('../middleware/auth')
const SteamUtil = require('../util/SteamUtil')


router.use(auth)

//Every time this is hit the user, their friends and appIds are updated. 
//May need to revist this
router.get('/profile', async (req, res) => {
  try {
    const steamUtil = new SteamUtil(req.user.steamApiKey)
    const user = await steamUtil.getOrNewSteamUser(
      req.user.steamid, { includeAppIds: true, includeFriendIds: true })
    res.status(200).send(user)
  } catch (e) {
    res.status(500).send(e)
  }
})

router.get('/friends', async (req, res) => {
  try {
    const steamUtil = new SteamUtil(req.user.steamApiKey)
    const details = await steamUtil.getFriendsDetails(
      req.user.steamid, { includeAppIds: true, update: true }
    )
    res.status(200).send(details)
  } catch (e) {
    res.status(500).send(e)
  }
})


router.get('/shared-games', async (req, res) => {
  try {
    let steamIds = req.query.steamIds
    if (!steamIds)
      return res.status(400).send({ error: 'you must provide the \'steamIds\' query param' })

    steamIds = steamIds.split(',')

    if(!(steamIds.length > 1))
      return res.status(400).send({ error: 'you must provide more than one steamId' })

    const steamUtil = new SteamUtil(req.user.steamApiKey)
    const sharedGames = await steamUtil.getSharedGames(steamIds)

    res.status(200).send(sharedGames)

  } catch (e) {
    res.status(500).send(e)
  }
})


module.exports = router
