const exchange = require('../exchange.js')



const smartSell = {}

smartSell.start = async ({asset, days, amount, exchangeName, pairing}) => {

  // get orderbook best sell price:
 async function getPrice(asset,limit, exchangeName, pairing){
    const price = await exchange.getPrice(asset,limit, exchangeName, pairing)
    return price
  }
  const bestPrice = await getPrice(asset, 1, exchangeName, pairing)
  .then(price => (price))
  //----------------------------------------------------------------
  // get minQuantity allowed: 
  async function getMinQauntity(exchangeName, asset, pairing){
    const minQuantity = await exchange.getMinQauntity(exchangeName, asset, pairing)
    return minQuantity
  }
  const minQuantity = await getMinQauntity(exchangeName, asset, pairing)
  //----------------------------------------------------------------
   function calcIntervals(days){
      const minutes = Number(days) * 24 * 60 * 60
      return minutes
    }
    const intervals = calcIntervals(days)
  // --------------------------------------------------------------
    function getAmount(amount, intervals){
      const rand = Math.floor(Math.random() * Math.floor(10))
      const orderAmount = amount / intervals * rand
    return orderAmount
  }
  //-----------------------------------------------------------------
  // Generate Order
  function generateOrder({asset, intervals, amount, minQuantity, exchangeName,pairing , bestPrice}){
  const orderAmount = getAmount(amount, intervals)  
  const order = {
    asset: asset,
    amount: orderAmount,
    exchangeName: exchangeName,
    pairing: pairing,
    price: bestPrice
  }
  return order
}

const preGen = {
  asset: asset,
  intervals: intervals,
  amount: amount,
  minQuantity: minQuantity,
  exchangeName: exchangeName,
  pairing: pairing,
  bestPrice: bestPrice
}

const order = generateOrder(preGen)
exchange.limitOrder(order)
const OA=amount
let go = true
while (go) {
  
  //get new price, 
  // Every second check price
    async function getNewPrice(asset, limit, exchangeName, pairing) {
      const price = await new Promise((resolve, reject) => {
        setTimeout((asset,limit, exchangeName, pairing) => {
          resolve(exchange.getPrice(asset,limit, exchangeName, pairing))
        }, 1000, asset,limit, exchangeName, pairing)
      })
      .then(price => (price))

      return price
    }
    const price = await getNewPrice(asset,1, exchangeName, pairing)

    // if price has changed,cancel all orders on pair and place new order, getting the price again
    if(price !== order.price){
      console.log('price difference', order.price, price)
      // delete all orders on pair
      console.log('cancelling orders')
      exchange.cancelOrders(asset, exchangeName, pairing)
      .then(async ()=>{
        // get best ask price
        console.log('placing new order')
        const price = await getPrice(asset,1, exchangeName, pairing)
        .then(lastPrice =>(lastPrice))
        // place new order
        const preGen = {
          asset: 'BTC',
          intervals: intervals,
          amount: OA,
          minQuantity: minQuantity,
          exchangeName: 'bitmax',
          pairing: 'USDT',
          bestPrice: price
        }
        const order = generateOrder(preGen)
        console.log('order is', order)
       const res = exchange.limitOrder(order)
      })
    }
  }

}

module.exports = smartSell