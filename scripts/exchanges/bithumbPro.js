require('dotenv').config()
const CCXT = require('../extension/bithumbProCCXT')
const ccxt = new CCXT({
  apiKey: process.env.bithumbPro_API_PRO_KEY,
  secret: process.env.bithumbPro_API_PRO_SECRET,
})


const bithumbPro = {}

bithumbPro.marketSell = async (order) =>{
  const pair = order.asset + '/' + order.pairing
  const price = await bithumbPro.ticker(order.asset)
  console.log('price')
  const newOrder = {
    symbol: pair,
    type: 'market',
    side: 'sell',
    quantity: order.amount,
    price: price
  }
  console.log('new Order is', newOrder)
const response = await ccxt.createOrder(newOrder.symbol, newOrder.type, newOrder.side, newOrder.quantity, newOrder.price)
.then(res => (res))
.catch(err => console.log(err))
console.log(response)
return response
}

bithumbPro.limitOrder = async (order) =>{
 
    const newOrder = {
      symbol: order.asset + '/' + order.pairing,
      type: 'market',
      side: 'sell',
      quantity: order.amount,
      price: order.price
    }
    console.log(newOrder)
const response = await ccxt.createOrder(newOrder.symbol, newOrder.type, newOrder.side, newOrder.quantity, newOrder.price)  
.then(res => (res))
return response
}

bithumbPro.getPrice = async (asset, pairing) => {
  const pair = asset + "/" + pairing
  const price = await ccxt.fetchOrderBook(pair)
  .then((orderbook) =>(orderbook.asks[0][0]))
  console.log('orderbook is', price)
  return price
}

bithumbPro.cancelOrders = async (asset, pairing) => {
  const pair = asset + "/" + pairing
  const response = await ccxt.cancelOrders(pair)
  .then(res => (res))
  console.log(response)
}

bithumbPro.getMinQuantity = async (asset, pairing) => {
const price = await bithumbPro.ticker(asset, pairing)
.then(res =>(res))
const minSize = 5 / price
return minSize
}

bithumbPro.getAmount = async (asset) =>{
  const balance = await ccxt.fetchBalance()
  .then(res =>{
    console.log('res from balance is', res);
  })
  .catch(err => console.log(err))
  console.log(balance)
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

bithumbPro.getMarkets = async () =>{
  const markets = await ccxt.fetchMarkets()
  .then(result => (result))
  console.log(markets)
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