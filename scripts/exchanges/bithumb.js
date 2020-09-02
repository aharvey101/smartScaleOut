require('dotenv').config()
const BITHUMBREST = require('../extension/bithumb')

// ppossibly just change the api endpoint variable

const connection = new BITHUMBREST(
  apiKey=process.env.BITHUMB_API_PRO_KEY,
  secret=process.env.BITHUMB_API_PRO_SECRET,
)

const bithumb = {}

bithumb.marketSell = async (order) =>{

  const newOrder = {
    symbol: order.asset + '-USDT',
    type: 'market',
    side: 'sell',
    quantity: order.amount
  }
const response = await connection.marketSell(newOrder.symbol, newOrder.type, newOrder.side,undefined, newOrder.quantity)
.then((response=>console.log(response)))
console.log(response);
return response
}

bithumb.getAmount = async (asset) =>{
  const balance = await connection.fetchBalance(params = {})
  .then(res =>{
    console.log('res from balance is', res);
  })
  .catch(err => console.log(err))
  console.log(balance)
  return balance
}

bithumb.ticker = async (asset) =>{
  const pair = asset + '-BTC'
  const ticker = await connection.getTicker(pair)
  .then(res => (res))
  return ticker
}

bithumb.getServerTime = async () => {
  const serverTime = await connection.getServerTime()
  return serverTime
}

bithumb.getAccount = async () => {
  const accountInfo = await connection.getAccount()
  return accountInfo
}

module.exports = bithumb