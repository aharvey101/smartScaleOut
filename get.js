// const bithumb = require('./scripts/extension/bithumb')
const bitmax = require('./scripts/exchanges/bitmax')

async function getMarketData(){
  const asset = 'BTC'
const balance = await bitmax.getMinQauntity(asset)

console.log(balance)
}

getMarketData()
