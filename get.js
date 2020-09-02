// const bithumb = require('./scripts/extension/bithumb')
const axios = require('axios')
const bitmax = require('./scripts/exchanges/bitmax')

// async function getMarketData(){
//   const asset = 'ETH'
// const balance = await bitmax.getMinQauntity(asset)

// console.log(balance)
// }

// getMarketData()


// async function sell(asset, amount) {
//   const selling = await bitmax.sell(asset, amount)

//   console.log(selling)
// }

// sell('ETH', 0.00001)

const bithumb = require('./scripts/exchanges/bithumb')

const getAccount = async () => {
  const accountInfo = await bithumb.getAccount()
  console.log(accountInfo)
}

getAccount()

// function marketSell(){
//   const order = {
//     asset: 'ETH',
//     amount: 0.1
//   }
//   bithumb.marketSell(order)
//   .then(res => console.log(res))
// }


// async function ticker() {
//   bithumb.ticker('ETH')
//   .then(res =>console.log(res))
// }

// ticker()

// async function serverTime(){
//   bithumb.getServerTime()
//   .then(res =>console.log(res))
// }

// serverTime()


// async function getServerTime(apiUrl) {
//   const timestamp = await axios({
//     method: 'GET',
//     url: apiUrl + '/serverTime'
//   })
//   .then(response => (response))
//   .catch(error => console.log(error))
//   console.log('timestamp is', timestamp.data);
//   return timestamp.data
// }

// const url = 'http://global-openapi.bithumb.pro/openapi/v1'

// getServerTime(url)