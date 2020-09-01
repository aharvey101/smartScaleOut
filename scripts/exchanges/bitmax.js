const CCXT = require('ccxt')

const ccxt = new CCXT.bitmax({
  apiKey: process.env.BITMAX_API_KEY,
  secret: process.env.BITMAX_API_SECRET,
  
})
const bitmax = {}

bitmax.sell = ({asset, amount}) =>{
  const pair = asset + '/USDT'
  ccxt.createOrder(pair, 'market', 'sell', amount, )
}

bitmax.getAmount = async (asset) =>{
 
  const balance = await ccxt.fetchBalance()
  .then(res =>{
   return res[asset].total
  })
  .catch(err => console.log(err))

  return balance
}

bitmax.getMarkets = async (asset) =>{

  const pair = asset + '/USDT'
  console.log(pair)
  const markets = await ccxt.fetchMarkets()
  .then(res => res)
// console.log(markets)
  const filtered = markets.find(market => market.id === asset + '/USDT')
  console.log(filtered)

}

bitmax.getMinQauntity = async(asset) => {
  const pair = asset + '/USDT'
  const minQuantity = await ccxt.fetchMarkets()
  .then(markets => markets.find(market => market.id === pair).info.minQty)
  return minQuantity
}

module.exports = bitmax