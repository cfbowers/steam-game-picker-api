const request = require('request')

const baseAPI = 'https://api.steampowered.com'


const get = async (path, key) => {
    return await request.get(baseAPI + path)
}

const getOwnedGames = async (steamID, key) => {
    
}

get(`/IPlayerService/GetOwnedGames/v1?steamid=${id}&include_appinfo=1`)