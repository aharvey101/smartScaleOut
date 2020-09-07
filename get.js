// const bithumb = require('./scripts/extension/bithumb')
const axios = require('axios')
const bitmax = require('./scripts/exchanges/bitmax')
const exchange = require('./scripts/exchange')

const bithumb = require('./scripts/exchanges/bithumb')

// async function getMinQuantity() {
//   const minQuantity = await bithumb.getMinQuantity('BTC', 'USDT')
//   .then(result => (result))
//   console.log(minQuantity)
// }
// getMinQuantity()

// async function getPrice() {
//   const price = await bithumb.getPrice('BTC', 'USDT')
// }
// getPrice()

// async function getBalance() {
//   const balance = await bithumb.getAccount()
//   .then(result => (result))
//   console.log(balance)
// }

// getBalance()

async function sell(){
  const order = {
    asset: "BTC",
    pairing: "USDT",
    amount:0.0001,
    price: 10000
  }
  const response = await bithumb.limitOrder(order)
  console.log(response);
}

sell()

// async function markets(){
//   const ticker = await bithumb.getMarkets('BTC')
//   .then(result => (result))
//   console.log(ticker)
// }
// markets()