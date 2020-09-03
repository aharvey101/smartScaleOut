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
  console.log('best price is', bestPrice)
  // get minQuantity allowed: 
  async function getMinQauntity(exchangeName, asset){
    const minQuantity = await exchange.getMinQauntity(exchangeName, asset)
    return minQuantity
  }
  const minQuantity = await getMinQauntity(exchangeName, asset)

  // Generate Order
  async function generateOrder(days, amount, minQuantity,exchangeName, pairing){
    function calcIntervals(days){
      const minutes = Number(days) * 24 * 60 * 60
      return minutes
    }
    const intervals = calcIntervals(days)

    async function getAmount(amount, intervals){
      const rand = Math.floor(Math.random() * Math.floor(10))
      const orderAmount = amount / intervals * rand
    return orderAmount
  }
  const orderAmount = await getAmount(amount, intervals)
  if(orderAmount < minQuantity){
    return orderAmount * 10
  }

  const order = {
    asset: asset,
    amount: orderAmount,
    exchangeName: exchangeName,
    pairing: pairing
  }
  return order
}

const order = await generateOrder(days, amount, minQuantity,exchangeName, pairing)
console.log(order)

 
  // place order at best sell price

  
  // on price goes through sell order price, get orderbook best sell price, create new order


}

module.exports = smartSell