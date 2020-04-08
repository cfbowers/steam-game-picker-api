/* eslint-disable max-len */
const fetch = require('node-fetch');
const qs = require('querystring');


async function get(resource, params, useStore = false) {
  const api = 'https://api.steampowered.com'; 
  const store = 'https://store.steampowered.com/api'; 
  const opts = { method: 'GET',  headers: { 'Content-Type': 'application/json' } }; 
  const base = (useStore) ? store : api; 
  const path = base + resource + '?' + qs.stringify(params);
  const result = await fetch(path, opts);
  return await result.json(); 
}

const getFriends   = (key, steamid)  => get('/ISteamUser/GetFriendList/v1', { key, steamid });
const getUserGames = (key, steamid)  => get('/IPlayerService/GetOwnedGames/v1', { key, steamid });

async function getSteamUser (key, steamid) {
  const result = await get('/ISteamUser/GetPlayerSummaries/v2', { key, steamids: steamid });
  return result.response.players[0];
}

async function getUserDetails(key, steamid, includeFriends = true, includeApps = true) {
  const user = await getSteamUser(key, steamid); 
  if (includeFriends) user.friends = await getFriendIds(key, steamid); 
  if (includeApps) user.appIds = await getUserAppIds(key, steamid);
  return user; 
}

async function getUsersDetails(key, steamids, includeFriends = true, includeApps = true) {
  return Promise.all(steamids.map(s => getUserDetails(key, s, includeFriends, includeApps))); 
}

async function getUserAppIds (key, steamid) {
  const result = await getUserGames(key, steamid); 
  const games = result.response.games;
  return games.map(g => g.appid); 
}

async function getFriendIds (key, steamid) { 
  const result = await getFriends(key, steamid);
  const friends = result.friendslist.friends; 
  return friends.map(f => f.steamid);
} 

async function getFriendsDetails (key, steamid, includeFriends = true, includeApps = true) {
  const friendIds = await getFriendIds(key, steamid); 
  return await getUsersDetails(key, friendIds, includeFriends, includeApps); 
}


async function getGameDetails (appId) {
  const result = await get('/appdetails', { appids: appId }, true); 
  return result[appId].data; 
}


module.exports = { getUserDetails, getFriendsDetails, getGameDetails }; 