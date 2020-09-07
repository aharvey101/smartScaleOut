// const bithumb = require('./scripts/extension/bithumb')
const axios = require('axios')
const bitmax = require('./scripts/exchanges/bitmax')
const exchange = require('./scripts/exchange')

const bithumb = require('./scripts/exchanges/bithumb')
const {Exchange} = require ('ccxt');

console.log(Exchange)


// async function test(){

//   const res = await bithumb.getAccount()
//   .then(res=>(res))
//   console.log(res)
// }
// test()

// const order = {
//   asset: "BTC",
//   price: 10500,
//   pairing: "USDT",
//   amount: 0.001,
//   exchangeName: "bitmax"
// }
// function placeOrder(){
//   console.log('placingOrder')
//   exchange.limitOrder(order)
// }
// placeOrder()

//test bitmax account balance

function getAccount() {
  console.log('getting account')
  exchange.getAmount(undefined, 'bithumb')
}

getAccount()
