require('dotenv').config()
const bithumbProCustom = require('./scripts/extension/bithumbProCustom.js')
const bpc = new bithumbProCustom(
  process.env.BITHUMB_API_PRO_KEY,
  process.env.BITHUMB_API_PRO_SECRET
)


const marketSell = async (input)=>{
  const pair = input.asset + '/' + input.pairing
  input.pair = pair
  const response = await bpc.marketSell(input).then(res=>(res))
  console.log(response)
}

const date =  Date.now()
console.log(date)

const input = {
  asset: "BTC",
  pairing: "USDT",
  side: "sell",
  type: 'market',
  price: -1,
  quantity: 0.001,
  timestamp: Date.now()
  
}

// marketSell(input)

const getAccount = async (input) =>{
  const response = await bpc.getAccount(input).then(res=>(res))
  console.log(response)
}
getAccount(input)