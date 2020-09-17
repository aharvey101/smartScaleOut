const CCXT = require('ccxt');

const ccxt = new CCXT.bitmex({
  apiKey: process.env.BITMEX_TEST_API_KEY,
  secret: process.env.BITMEX_TEST_API_SECRET,
  verbose: false,
  enableRateLimit: true
})
if(ccxt.urls['test']){
  ccxt.urls['api'] = ccxt.urls['test']
}

const bitmex = {}

bitmex.getBalance = async (input) => {

  const account = await ccxt.fetchBalance().then(res => (res))
  return account
}

// - [x] Test and modify
bitmex.marketSell = async ({asset, amount, pairing}) =>{
  const pair = asset + '/' + pairing
  const response = await ccxt.createOrder( pair, 'market', 'sell', amount)
  .then(res => (res))
  .catch(err => console.log(err))
  return response
}

bitmex.marketBuy = async ({asset, amount, pairing}) => {
  const pair = asset + "/" + pairing
  const response = await ccxt.createOrder( pair, 'market', 'buy', amount,)
  .then(res => (res))
  return response
}
// - [x] test and make changes
bitmex.limitSell = async (order) => {
  const pair = order.asset + '/' + order.pairing
  const response = await ccxt.createOrder(pair, 'limit', 'sell', order.amount, order.price)
  .then(res =>{
    return res.info.orderID
  })
  return response
}
// - [x] test and make changes
bitmex.limitBuy = async (order) =>{
  const pair = order.asset + '/' + order.pairing
  const response = await ccxt.createOrder(pair, 'limit', 'buy', order.amount, order.price)
  .then(res =>(res.info.orderID))
  return response
}

// - [x] test and make changes
bitmex.getMarkets = async (asset, pairing) =>{

  const pair = asset + '/' + pairing
  const markets = await ccxt.fetchMarkets()
  .then(res => (res))
  const filtered = markets.find(market => (market.symbol) = pair)
  return filtered
}
// - [] test and make changes
bitmex.minTick = async (asset, pairing)=>{
  const pair = asset + '/' + pairing
  const market = await ccxt.fetchMarkets(pair).then(res => (res))
  console.log(market)
  return
  const filtered = market.find(market => market.id = pair)
  console.log(filtered);
  const minTick = filtered.info.minQty
  const parsed = Number(minTick).toFixed(10)
  const number = Number(parsed)
  console.log(number)
  return parsed
}
// - [x] test and make changes
bitmex.getAskPrice = async (asset, limit, pairing) => {
  const pair = asset + "/" + pairing
  const price = await ccxt.fetchOrderBook(pair, limit)
  .then((orderbook) =>(orderbook.asks[0][0]))
  console.log('orderbook is', price)
  return price
}

bitmex.getMinQuantity = async(asset, pairing) => {  
  const price = await bitmex.ticker(asset, pairing)
  .then(res =>(res))
  .catch(err => console.log(err))
  const minSize = 5.1 / price
  console.log(minSize);
  return minSize
}
// - [x] test and make changes
bitmex.ticker = async (asset, pairing)=>{
  const pair = asset + '/' + pairing
  const price = await ccxt.fetchTicker(pair)
  .then( result => (result.last))
  return price
}
bitmex.cancelOrders = async (asset, pairing, orderId)=> {
  const pair = asset + '/' + pairing
  const response = await ccxt.cancelOrder(orderId,pair)
  .then((response) =>(response))
  return response
}

bitmex.getCandles = async (asset, pairing, timeframe, limit) => {
  const pair = asset  + "/" + pairing
  const response = await ccxt.fetchOHLCV(pair, timeframe, undefined, limit).then(res => (res))
  return response.reverse()
}

bitmex.orderBook = async (asset, pairing, limit) => {
  const pair = asset + "/" +pairing
  const orderbook = await ccxt.fetchOrderBook(pair).then (res => (res))
  return orderbook
}

bitmex.getOrderStatus = async (orderId, asset, pairing) => {
  const pair = asset + '/' + pairing
  // return only the order status
    const response = await ccxt.fetchOrder(orderId, pair).then (res =>(res))
    return response.info.status
  }


bitmex.getMarkets = async (asset, pairing)=>{
  const pair = asset + pairing
  const markets = await ccxt.fetchMarkets().then(response => (response))
  const market = markets.find(market => market.symbol = pair)
  
  return market
}

module.exports = bitmex