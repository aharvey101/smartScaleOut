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


async function getCandles() {
  const candles = await exchange.getCandles("BTC", "USDT", 'bitmax',"1m", 50).then(res => (res))
  console.log(candles)
}

getCandles()