const idAndName = (dbUserOrGame) => {
  let name = ''
  let id = ''

  if (dbUserOrGame.steamID) {
    name = dbUserOrGame.nickname || dbUserOrGame.realName || undefined
    id = dbUserOrGame.steamID
  }
  
  if (dbUserOrGame.steam_appid) {
    name = dbUserOrGame.name || dbUserOrGame.short_description || undefined
    id = dbUserOrGame.steam_appid
  }

  return `${id}: ${name}`
}

const getCommon = (array1, array2) => {
  const smallerSet = (array1.length > array2.length) ? array2 : array1 
  const largerSet = (array1.length > array2.length) ? array1 : array2
  const common = smallerSet.filter(appID => {
    return largerSet.includes(appID)
  }) 
  return common
}

module.exports = {
  idAndName,
  getCommon
}