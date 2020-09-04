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

bitmax.limitSell = async (order) => {
  const pair = order.asset + '/' + order.pairing
  const response = await ccxt.createOrder(pair, 'limit', 'sell', order.amount, order.price)
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

bitmax.getMinQauntity = async(asset, pairing) => {
  const pair = asset + '/' + pairing
  
  const minSize = await ccxt.fetchMarkets()
  // .then(result => console.log(result))
  .then(markets => markets.find(market => market.id === pair).info.lotSize)
  // console.log(minSize)
  return minSize
}

bitmax.cancelOrders = async (asset, pairing)=> {
  const pair = asset + '/' + pairing
  const response = await ccxt.cancelAllOrders(pair)
  .then((response) =>(response))
  console.log(response)
  return response
}

module.exports = bitmax