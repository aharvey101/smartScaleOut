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
  // get minQuantity allowed: 
  async function getMinQauntity(exchangeName, asset, pairing){
    const minQuantity = await exchange.getMinQauntity(exchangeName, asset, pairing)
    return minQuantity
  }
  const minQuantity = await getMinQauntity(exchangeName, asset, pairing)

  // Generate Order
  function generateOrder({asset, days, amount, minQuantity,exchangeName, pairing, bestPrice}){
    function calcIntervals(days){
      const minutes = Number(days) * 24 * 60 * 60
      return minutes
    }
    const intervals = calcIntervals(days)
  
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
  days: days, 
  amount: amount,
  min: minQuantity,
  exchangeName: exchangeName,
  pairing: pairing,
  bestPrice: bestPrice
}

console.log('generateOrder',generateOrder(preGen))

const order = await generateOrder(days, amount, minQuantity,exchangeName, pairing)
.then(order =>(order))

  // place order at best sell price
  exchange.limitOrder(order)
  
  // on price goes through sell order price, get orderbook best sell price, create new order
  // create look that checks for price
  // if during the loop price is detected to have changed,


}

module.exports = smartSell