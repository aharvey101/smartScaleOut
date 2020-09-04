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
    //---------------------------------
  // Generate Order
  function generateOrder({asset, intervals, amount, minQuantity,exchangeName, pairing, bestPrice}){
    function getAmount(amount, intervals){
      const rand = Math.floor(Math.random() * Math.floor(10))
      const orderAmount = amount / intervals * rand
    return orderAmount
  }
  const orderAmount = getAmount(amount, intervals)
  if(orderAmount < minQuantity){
    return orderAmount * 10
  }
  
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
//TODO:
// --------------------------------
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
      // delete all orders on pair
      exchange.cancelOrders(asset, exchangeName, pairing)
      .then(()=>{
        // place new order
        const preGen = {
          asset: asset,
          intervals: intervals,
          amount: amount,
          minQuantity: minQuantity,
          exchangeName: exchangeName,
          pairing: pairing,
          bestPrice: getPrice()
        }
        const order = generateOrder(preGen)
        exchange.limitOrder(order)
      })
    }
    

  }

}

module.exports = smartSell