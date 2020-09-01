// const bithumb = require('./scripts/extension/bithumb')
const bitmax = require('./scripts/exchanges/bitmax')

async function getMarketData(){
  const asset = 'ETH'
const balance = await bitmax.getMinQauntity(asset)

console.log(balance)
}

getMarketData()


// async function sell(asset, amount) {
//   const selling = await bitmax.sell(asset, amount)

//   console.log(selling)
// }

// sell('ETH', 0.00001)