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
  // .then(res =>{
  //   console.log(res)
  // })
  .then(res =>(res))
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
  return filtered
}

bitmax.getPrice = async (asset, limit, pairing) => {
  const pair = asset + "/" + pairing
  const price = await ccxt.fetchOrderBook(pair, limit)
  .then((orderbook) =>(orderbook.asks[0][0]))
  console.log('orderbook is', price)
  return price
}

bitmax.getMinQuantity = async(asset, pairing) => {
  // const pair = asset + '/' + pairing
  // const minSize = await ccxt.fetchMarkets()
  // .then(markets => markets.find(market => market.id === pair).info.lotSize)
  // build get $5 amount from exchange
  // $5 / price
  
  const price = await bitmax.ticker(asset, pairing)
  .then(res =>(res))
  // console.log('price is', price);
  const minSize = 5 / price
  return minSize
}

bitmax.ticker = async (asset, pairing)=>{
  const pair = asset + '/' + pairing
  const price = await ccxt.fetchTicker(pair)
  .then( result => (result.last))
  return price
}

bitmax.cancelOrders = async (asset, pairing)=> {
  const pair = asset + '/' + pairing
  const response = await ccxt.cancelAllOrders(pair)
  .then((response) =>(response))
  return response
}

module.exports = bitmax