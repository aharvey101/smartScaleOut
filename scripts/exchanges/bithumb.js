const CCXT = require('ccxt')

const ccxt = new CCXT.bithumb({
  apiKey: process.env.BITHUMB_API_KEY,
  secret: process.env.BITHUMB_API_SECRET,
})

const bithumb = {}

bithumb.sell = (order) =>{
  ccxt.createOrder()
}

bithumb.getAmount = (asset) =>{
  ccxt.fetchBalance(params = {})
  .then(res =>{
    console.log(res);
  })
}

module.exports = bithumb