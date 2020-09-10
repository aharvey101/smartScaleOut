require('dotenv').config()
const CCXT = require('../extension/bithumbProCCXT')
const ccxt = new CCXT({
  apiKey: process.env.BITHUMBPRO_API_KEY,
  secret: process.env.BITHUMBPRO_API_SECRET,
})


const bithumbPro = {}

bithumbPro.marketSell = async (order) =>{

  const newOrder = {
    symbol: order.asset + '/' + order.pairing,
    type: 'market',
    side: 'sell',
    quantity: JSON.stringify(order.amount),
  }
const response = await ccxt.createOrder(newOrder.symbol, newOrder.type, newOrder.side, newOrder.quantity, newOrder.price, )
.then(res => (res))
.catch(err => console.log(err))
return response
}

bithumbPro.limitSell = async (order) =>{
 
    const newOrder = {
      symbol: order.asset + '/' + order.pairing,
      type: 'limit',
      side: 'sell',
      quantity: order.amount,
      price: order.price
    }
const response = await ccxt.createOrder(newOrder.symbol, newOrder.type, newOrder.side, newOrder.quantity, newOrder.price)  
.then(res => (res.info.data.orderId))
.catch(err => console.log(err))
return response
}

bithumbPro.getPrice = async (asset, pairing) => {
  const pair = asset + "/" + pairing
  const price = await ccxt.fetchOrderBook(pair)
  .then((orderbook) =>(orderbook.asks[0][0]))

  return price
}

bithumbPro.cancelOrders = async (asset, pairing, orderId) => {
  const pair = asset + "/" + pairing
  const response = await ccxt.cancelOrder(orderId, pair)
  .then(res => (res))
  .catch(err => console.log(err))
}

bithumbPro.getMinQuantity = async (asset, pairing) => {
  // currently gets $5 worth of the asset, might change to min order quantity
const price = await bithumbPro.ticker(asset, pairing)
.then(res =>(res))
const minSize = 5 / price


return minSize
}

bithumbPro.getAmount = async (asset) =>{
  const balance = await ccxt.fetchBalance()
 
  .catch(err => console.log(err))
  return balance
}

bithumbPro.ticker = async (asset) =>{
  const pair = asset + '/USDT'
  const ticker = await ccxt.fetchTicker(pair)
  .then(res => (res.last))
  return ticker
}

bithumbPro.getServerTime = async () => {
  const serverTime = await ccxt
  return serverTime
}

bithumbPro.getMarkets = async (asset, pairing) =>{
  const pair = asset + "-" + pairing
  const markets = await ccxt.fetchMarkets()
  .then(result => (result))
  const filtered = markets.filter(market => (market.id === pair))
  return filtered
}

bithumbPro.getAccount = async () => {
  const accountInfo = await ccxt.fetchBalance()
  .then((balance) =>(balance))
  return accountInfo
}

bithumbPro.getCandles = async (asset, pairing, timeframe, limit) => {
  const pair = asset  + "/" + pairing
  const response = await ccxt.fetchOHLCV(pair, timeframe, undefined, limit).then(res => (res))
  return response
}

module.exports = bithumbPro