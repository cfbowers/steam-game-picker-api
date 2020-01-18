const router = require('express').Router()
const auth = require('../middleware/auth')
const SteamUtil = require('../util/SteamUtil')


router.use(auth)

router.get('/profile', async (req, res) => {
  try {
    const steamUtil = new SteamUtil(req.user.steamApiKey)
    const user = await steamUtil.getOrNewSteamUser(req.user.steamid)
    res.status(200).send(user)
  } catch (e) {
    res.status(500).send(e)
  }
})

router.post('/profile/update', async (req, res) => {
  try {
    let success = 'completed update of profile'
    const steamUtil = new SteamUtil(req.user.steamApiKey)
    const includeFriendsInUpdate = (req.query.includeFriends === 'true')
    await steamUtil.getOrNewSteamUser(req.user.steamid, { update: true })
    if (includeFriendsInUpdate) {
      //Will not get friends of friends, on friends and their appIds
      await steamUtil.getFriendsDetails(req.user.steamid, { update: true, saveFriendIds: false })
      success += ' and profiles of friends'
    }
    res.status(200).send({ success })
  } catch (e) {
    res.status(500).send(e)
  }
})


router.get('/friends', async (req, res) => {
  try {
    const steamUtil = new SteamUtil(req.user.steamApiKey)
    const details = await steamUtil.getFriendsDetails(req.user.steamid)
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
    steamUtil.get
    const sharedGames = await steamUtil.getSharedGames(steamIds)

    res.status(200).send(sharedGames)

  } catch (e) {
    res.status(500).send(e)
  }
})


module.exports = router
