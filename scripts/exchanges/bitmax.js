require('dotenv').config()
const CCXT = require('ccxt')

const ccxt = new CCXT.bitmax({
  apiKey: process.env.BITMAX_API_KEY,
  secret: process.env.BITMAX_API_SECRET,
  
})
const bitmax = {}

bitmax.marketSell = async ({asset, amount, pairing}) =>{

  const pair = asset + "/" + pairing
  const response = await ccxt.createOrder( pair, 'market', 'sell', amount,)
  .then(res => (res))
  return response
}

bitmax.limitSell = async (order) => {
  const pair = order.asset + '/' + order.pairing
  const response = await ccxt.createOrder(pair, 'limit', 'sell', order.amount, order.price)
  .then(res =>(res.info.orderId))
  return response
}

bitmax.limitBuy = async (order) =>{
  const pair = order.asset + '/' + order.pairing
  const response = await ccxt.createOrder(pair, 'limit', 'buy', order.amount, order.price)
  .then(res =>(res.info.orderId))
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

bitmax.getMarkets = async (asset, pairing) =>{

  const pair = asset + '/' + pairing
  const markets = await ccxt.fetchMarkets()
  .then(res => res)
  const filtered = markets.find(market => market.id = pair)
  return filtered
}

bitmax.minTick = async (asset, pairing)=>{
  const pair = asset + '/' + pairing
  const market = await ccxt.fetchMarkets(pair).then(res => (res))
  const filtered = market.find(market => market.id = pair)
  console.log(filtered);
  const minTick = filtered.info.minQty
  const parsed = Number(minTick).toFixed(10)
  const number = Number(parsed)
  console.log(number)
  return parsed
}

bitmax.getAskPrice = async (asset, limit, pairing) => {
  const pair = asset + "/" + pairing
  const price = await ccxt.fetchOrderBook(pair, limit)
  .then((orderbook) =>(orderbook.asks[0][0]))
  console.log('orderbook is', price)
  return price
}

bitmax.getMinQuantity = async(asset, pairing) => {  
  const price = await bitmax.ticker(asset, pairing)
  .then(res =>(res))
  .catch(err => console.log(err))
  const minSize = 5.1 / price
  console.log(minSize);
  return minSize
}

bitmax.ticker = async (asset, pairing)=>{
  const pair = asset + '/' + pairing
  const price = await ccxt.fetchTicker(pair)
  .then( result => (result.last))
  return price
}
bitmax.cancelOrders = async (asset, pairing, orderId)=> {
  const pair = asset + '/' + pairing
  const response = await ccxt.cancelOrder(orderId,pair)
  .then((response) =>(response))
  return response
}

bitmax.getCandles = async (asset, pairing, timeframe, limit) => {
  const pair = asset  + "/" + pairing
  const response = await ccxt.fetchOHLCV(pair, timeframe, undefined, limit).then(res => (res))
  return response.reverse()
}

bitmax.orderBook = async (asset, pairing, limit) => {
  const pair = asset + "/" +pairing
  const orderbook = await ccxt.fetchOrderBook(pair).then (res => (res))
  return orderbook
}

bitmax.getOrderStatus = async (orderId) => {

  const response = await ccxt.fetchOrder(orderId).then (res =>(res))
  return response
}
module.exports = bitmax