const CCXT = require('ccxt')
require('dotenv').config()
const ccxt = new CCXT.bitmax({
  apiKey: process.env.BITMAX_API_KEY,
  secret: process.env.BITMAX_API_SECRET,
})


async function getMarketData(){
const balance = await ccxt.fetchBalance()
const asset = 'BTC'
console.log(balance[asset])
}

getMarketData()