const exchange = require('../exchange.js')

const smartSell = {}

smartSell.start = async ({ asset, days, amount, exchangeName, pairing }) => {
  // get orderbook best sell price:
  async function getAskPrice(asset, limit, exchangeName, pairing) {
    const price = await exchange.getAskPrice(
      asset,
      limit,
      exchangeName,
      pairing
    )
    // const minTick = await exchange.minTick(asset, pairing, exchangeName)
    return price
  }
  const bestPrice = await getAskPrice(asset, 1, exchangeName, pairing).then(
    (price) => price
  )
  //----------------------------------------------------------------
  // get minQuantity allowed:
  async function getMinQuantity(exchangeName, asset, pairing) {
    const minQuantity = await exchange.getMinQuantity(
      exchangeName,
      asset,
      pairing
    )
    return minQuantity
  }
  const minQuantity = await getMinQuantity(exchangeName, asset, pairing)
  //----------------------------------------------------------------
  function calcIntervals(days) {
    const minutes = Number(days) * 24 * 60 * 60
    return minutes
  }
  // get Intervals to be used to generate amount
  const intervals = calcIntervals(days)
  // --------------------------------------------------------------
  function getAmount(amount, intervals, minQuantity) {
    const rand = Math.floor(Math.random() * Math.floor(10))
    const orderAmount = (amount / intervals) * rand
    if (orderAmount < minQuantity) {
      return minQuantity
    }
    return orderAmount
  }
  //-----------------------------------------------------------------
  // Generate Order
  function generateOrder({
    asset,
    intervals,
    amount,
    minQuantity,
    exchangeName,
    pairing,
    bestPrice,
  }) {
    const orderAmount = getAmount(amount, intervals, minQuantity)
    const order = {
      asset: asset,
      amount: orderAmount,
      exchangeName: exchangeName,
      pairing: pairing,
      price: bestPrice,
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
    bestPrice: bestPrice,
  }

  const order = generateOrder(preGen)

  const orderIdArray = []
  const orderId = await exchange.limitSellOrder(order)
  orderIdArray.unshift(orderId)
  const OA = amount
  let go = true
  while (go) {
    //get new price,
    // Every second check orderbook for best ask price
    async function getNewAskPrice(asset, limit, exchangeName, pairing) {
      const price = await new Promise((resolve, reject) => {
        setTimeout(
          (asset, limit, exchangeName, pairing) => {
            resolve(exchange.getAskPrice(asset, limit, exchangeName, pairing))
          },
          1000,
          asset,
          limit,
          exchangeName,
          pairing
        )
      }).then((price) => price)
      return price
    }
    const price = await getNewAskPrice(asset, 1, exchangeName, pairing)

    // if price has changed,cancel all orders on pair and place new order, getting the price again
    if (price !== order.price) {
      console.log('price difference', order.price, price)
      // delete all orders on pair
      console.log('cancelling orders')
      // Possibly use order id instead of cancel every order incase we are running multiple strategies
      // on the one account
      const orderToCancel = orderIdArray[0]
      exchange
        .cancelOrders(asset, exchangeName, pairing, orderToCancel)
        .then(async () => {
          // get best ask price
          console.log('placing new order')
          const price = await getAskPrice(asset, 1, exchangeName, pairing).then(
            (lastPrice) => lastPrice
          )
          // place new order
          const preGen = {
            asset: asset,
            intervals: intervals,
            amount: OA,
            minQuantity: minQuantity,
            exchangeName: exchangeName,
            pairing: pairing,
            bestPrice: price,
          }
          const order = generateOrder(preGen)
          console.log('order is', order)
          const orderId = await exchange
            .limitSellOrder(order)
            .then((res) => res)
          orderIdArray.unshift(orderId)
          orderIdArray.pop()
          console.log('orderArray is', orderIdArray)
        })
    }
  }
}

module.exports = smartSell
