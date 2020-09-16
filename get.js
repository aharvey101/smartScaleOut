// const bithumb = require('./scripts/extension/bithumb')
const axios = require('axios')
const bitmax = require('./scripts/exchanges/bitmax')
const exchange = require('./scripts/exchange')
const talib = require('talib')
const bitmex = require('./scripts/exchanges/bitmex')

async function test() {

  const order = {
    asset: 'BTC',
    pairing: 'USD',
    amount: 1,
    limit: 50,
  }

  const response = await bitmex.ticker(order.asset, order.pairing).then(result =>(result))
  console.log(response);

}

test()

// async function listPairs (){
//   bitmex.getMarkets()
//   .then(res =>{
//     console.log(res)
//   })
// }

// listPairs()
// async function getMinTick(){

//   const asset = 'XRP'
//   const tick = await exchange.getMarkets(asset,'USDT', 'bitmax')
//   .then((market) =>{
//     console.log(market)
//   })
// }

// getMinTick()


// async function getCandles() {
//   const candles = await exchange.getCandles("IOST", "USDT", 'bithumbPro',"15m", 50).then(res => (res))
//   console.log(candles)
// }

// getCandles()

// const order = {
//   asset: "IOST",
//   pairing: "USDT",
//   amount: 1393.53424,
//   price: 0.0074,
//   exchangeName:"bithumbPro"
// }

// async function limitOrder(input) {
//   const res = await exchange.limitOrder(input).then(res=>(res))
//   console.log(res)
// }

// limitOrder(order)



// async function market(input) {
//   const market = await exchange.getMarkets("BTC", "USDT", 'bithumbPro')
//   console.log(market)
// }

// market()

// const input = {
//   asset: 'BTC',
//   pairing: "USDT",
//   exchangeName: 'bitmax',
// }
