const bithumb = require('./scripts/extension/bithumb')


async function getMarketData(){
const balance = await bithumb.fetchBalance()
const asset = 'BTC'
console.log(balance)
}

getMarketData()