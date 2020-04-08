const SteamUser = require('../data/models/steamUser');
const SteamGame = require('../data/models/steamGame');
const api = require('../util/steamApi'); 


const retrieveSteamUser = (steamid)     => SteamUser.findOne({ steamid }); 
const retrieveSteamGame = (steam_appid) => SteamGame.findOne({ steam_appid }); 

async function getSteamUser(key, steamid) {
  let user = await retrieveSteamUser(steamid); 
  if (!user) {
    user = new SteamUser(await api.getUserDetails(key, steamid, false)); 
    await user.save(); 
  }
  return user; 
}

async function getSteamGame(appId) {
  console.log(appId);
  let game = await retrieveSteamGame(appId); 
  if (!game) {
    game = new SteamGame(await api.getGameDetails(appId));
    await game.save();
  }
  return game; 
}

async function getSharedGames (key, steamids) {
  const users = await Promise.all(steamids.map(s => getSteamUser(key, s))); 
  const appIdArrays = users.map(u => u.appIds); 
  const sharedAppIds = getCommonElementsAmongAll(appIdArrays);
  return Promise.all(sharedAppIds.map(a => getSteamGame(a)));
}

function getCommonElementsAmongAll(arrays) {
  arrays = arrays.sort((a, b) => a.length - b.length); 
  let current = arrays.shift(); 
  for (let i = 0; i < arrays.length; i++) current = getCommonElements(current, arrays[i]); 
  return current; 
}

function getCommonElements(first, second) {
  const secondSet = new Set(second); 
  return first.filter(e => secondSet.has(e)); 
}


module.exports = { getSharedGames, getSteamUser };