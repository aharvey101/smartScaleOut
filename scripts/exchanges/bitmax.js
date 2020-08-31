const CCXT = require('ccxt')

const ccxt = new CCXT.bitmax({
  apiKey: process.env.BITMAX_API_KEY,
  secret: process.env.BITMAX_API_SECRET,
  
})
const bitmax = {}

bitmax.sell = ({asset, amount}) =>{

  const pair = asset + '/USDT'

  ccxt.createOrder(pair, 'market', 'sell', amount, )
}

bitmax.getAmount = async (asset) =>{
 
  const balance = await ccxt.fetchBalance()
  .then(res =>{
   return res[asset].free
  })
  .catch(err => console.log(err))

  return balance
}

module.exports = bitmax