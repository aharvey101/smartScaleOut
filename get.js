// const bithumb = require('./scripts/extension/bithumb')
const axios = require('axios')
const bitmax = require('./scripts/exchanges/bitmax')
const exchange = require('./scripts/exchange')

const bithumb = require('./scripts/exchanges/bithumb')

const order = {
  asset: "BTC",
  price: 12000,
  pairing: "USDT",
  amount: 0.001,
  exchangeName: "bitmax"
}
function placeOrder(){
  console.log('placingOrder')
  exchange.limitOrder(order)
}
placeOrder()
