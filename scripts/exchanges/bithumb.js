const CCXT = require('ccxt')

// ppossibly just change the api endpoint variable

const ccxt = new CCXT.bithumb({
  apiKey: process.env.BITHUMB_API_KEY,
  secret: process.env.BITHUMB_API_SECRET,
  verbose: true,
  
})

const bithumb = {}

bithumb.sell = (order) =>{

  console.log('would sell');
  // ccxt.createOrder()
}

bithumb.getAmount = async (asset) =>{
  const balance = await ccxt.fetchBalance(params = {})
  .then(res =>{
    console.log('res from balance is', res);
  })
  .catch(err => console.log(err))
  console.log(balance)
  return balance
}

module.exports = bithumb