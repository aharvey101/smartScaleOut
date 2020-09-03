require('dotenv').config()
const CCXT = require('ccxt')

const ccxt = new CCXT.bitmax({
  apiKey: process.env.BITMAX_API_KEY,
  secret: process.env.BITMAX_API_SECRET,
  
})
const bitmax = {}

bitmax.marketSell = async ({asset, amount, pairing}) =>{
  console.log(pairing)
  console.log('asset is', asset),
  console.log(amount)
  const pair = asset + "/" + pairing
  const response = await ccxt.createOrder( pair, 'market', 'sell', amount,)
  .then(res => (res))
  return response
}

bitmax.limitSell = async (asset, amount) => {
  const pair = asset
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
  return filtered
}

bitmax.getPrice = async (asset, limit, pairing) => {
  const pair = asset + "/" + pairing
  const price = await ccxt.fetchOrderBook(pair, limit)
  .then((orderbook) =>(orderbook.asks[0][0]))
  console.log('orderbook is', price)
  return price
}

bitmax.getMinQauntity = async(asset) => {
  const pair = asset + '/USDT'
  const minSize = await ccxt.fetchMarkets()
  .then(markets => markets.find(market => market.id === pair).info.tickSize)
  return minSize
}

module.exports = bitmax