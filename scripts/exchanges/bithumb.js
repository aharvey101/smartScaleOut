require('dotenv').config()
const CCXT = require('../extension/bithumbccxt')
const ccxt = new CCXT({
  apiKey: process.env.BITHUMB_API_PRO_KEY,
  secret: process.env.BITHUMB_API_PRO_SECRET,
})


const bithumb = {}

bithumb.marketSell = async (order) =>{
  const pair = order.asset + '/' + order.pairing
  const price = await bithumb.ticker(order.asset)
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

bithumb.limitOrder = async (order) =>{
 
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

bithumb.getPrice = async (asset, pairing) => {
  const pair = asset + "/" + pairing
  const price = await ccxt.fetchOrderBook(pair)
  .then((orderbook) =>(orderbook.asks[0][0]))
  console.log('orderbook is', price)
  return price
}

bithumb.cancelOrders = async (asset, pairing) => {
  const pair = asset + "/" + pairing
  const response = await ccxt.cancelOrders(pair)
  .then(res => (res))
  console.log(response)
}

bithumb.getMinQuantity = async (asset, pairing) => {
const price = await bithumb.ticker(asset, pairing)
.then(res =>(res))
const minSize = 5 / price
return minSize
}

bithumb.getAmount = async (asset) =>{
  const balance = await ccxt.fetchBalance()
  .then(res =>{
    console.log('res from balance is', res);
  })
  .catch(err => console.log(err))
  console.log(balance)
  return balance
}

bithumb.ticker = async (asset) =>{
  const pair = asset + '/USDT'
  const ticker = await ccxt.fetchTicker(pair)
  .then(res => (res.last))
  return ticker
}

bithumb.getServerTime = async () => {
  const serverTime = await ccxt
  return serverTime
}

bithumb.getMarkets = async () =>{
  const markets = await ccxt.fetchMarkets()
  .then(result => (result))
  console.log(markets)
}

bithumb.getAccount = async () => {
  const accountInfo = await ccxt.fetchBalance()
  .then((balance) =>(balance))
  return accountInfo
}

module.exports = bithumb