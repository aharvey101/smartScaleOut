// const bithumb = require('./scripts/extension/bithumb')
const axios = require('axios')
const bitmax = require('./scripts/exchanges/bitmax')
const exchange = require('./scripts/exchange')
const talib = require('talib')


// async function getMinTick(){

//   const asset = 'XRP'
//   const tick = await exchange.getMarkets(asset,'USDT', 'bitmax')
//   .then((market) =>{
//     console.log(market)
//   })
// }

// getMinTick()


// async function getCandles() {
//   const candles = await exchange.getCandles("BTC", "USDT", 'bitmax',"1m", 50).then(res => (res))
//   console.log(candles)
// }

// getCandles()

const order = {
  asset: "BTC",
  pairing: "USDT",
  amount: 0.001,
  price: 11000,
  exchangeName:"bitmax"
}

async function marketOrder(input) {
  const res = await exchange.limitOrder(input).then(res=>(res))
  console.log(res)
}

marketOrder(order)

// async function market(input) {
//   const market = await exchange.getMarkets("BTC", "USDT", 'bithumbPro')
//   console.log(market)
// }

// market()



