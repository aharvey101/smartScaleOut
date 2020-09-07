require('dotenv').config()
const CCXT = require('ccxt')
const ccxt = new CCXT.bithumbpro({
  apiKey: process.env.BITHUMB_API_PRO_KEY,
  secret: process.env.BITHUMB_API_PRO_SECRET,
})

const bithumb = {}

bithumb.marketSell = async (order) =>{

  const newOrder = {
    symbol: order.asset + '-USDT',
    type: 'market',
    side: 'sell',
    quantity: order.amount
  }
const response = await ccxt.marketSell(newOrder.symbol, newOrder.type, newOrder.side,undefined, newOrder.quantity)
.then((response=>console.log(response)))
console.log(response);
return response
}

bithumb.limitOrder = async (order) =>{
 
    const newOrder = {
      symbol: order.asset + '-USDT',
      type: 'market',
      side: 'sell',
      quantity: order.amount,
      price: order.price
    }
const response = await ccxt.limitOrder()  
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
  const pair = asset + '-BTC'
  const ticker = await ccxt.getTicker(pair)
  .then(res => (res))
  return ticker
}

bithumb.getServerTime = async () => {
  const serverTime = await ccxt
  return serverTime
}

bithumb.getAccount = async () => {
  const accountInfo = await ccxt.getAccount()
  return accountInfo
}

module.exports = bithumb