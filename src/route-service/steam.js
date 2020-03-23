async function updateSteamProfile ({ steamid }, steamUtil, includeFriends) {
  const profileUpdateOptions = { update: true, includeAppIds: true, includeFriendIds: true }; 
  await steamUtil.getOrNewSteamUser(steamid, profileUpdateOptions);

  if (includeFriends) {
    const friendUpdateOptions = { update: true, includeAppIds: true }; 
    await steamUtil.getFriendsDetails(steamid, friendUpdateOptions);
  }
  
  return 'completed update of profile' + ((includeFriends) ? ' and profiles of friends': ''); 
}


module.exports = { updateSteamProfile };