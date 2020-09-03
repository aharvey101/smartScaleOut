require('dotenv').config()
const CCXT = require('ccxt')

const ccxt = new CCXT.bitmax({
  apiKey: process.env.BITMAX_API_KEY,
  secret: process.env.BITMAX_API_SECRET,
  
})
const bitmax = {}

bitmax.sell = async (asset, amount) =>{
  const pair = asset + '/USDT'
  const response = await ccxt.createOrder( pair, 'market', 'sell', amount,)
  .then(res => (res))
  return response
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
 
  const filtered = markets.find(market => market.id === asset + '/USDT')


}

bitmax.getMinQauntity = async(asset) => {
  const pair = asset + '/USDT'
  const minSize = await ccxt.fetchMarkets()
  .then(markets => markets.find(market => market.id === pair).info.tickSize)

  return minSize
}

module.exports = bitmax