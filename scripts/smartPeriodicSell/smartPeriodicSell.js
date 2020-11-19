const exchange = require('../exchange')
// Bot Logic:

const smartScaleout = {
  start: async ({ asset, exchangeName, days, amount, pairing }) => {
    // get days
    // get amount
    // get intervals
    // devide amount by intervals times rand between 0 and 10
    // if orderAmount in getAmount is lower than exchange min quantity, return minQuantitu

    async function getMinQuantity(exchangeName, asset, pairing) {
      const minQuantity = await exchange.getMinQuantity(
        exchangeName,
        asset,
        pairing
      )
      return minQuantity
    }
    const minQuantity = await getMinQuantity(exchangeName, asset, pairing)

    async function generateOrder(
      days,
      amount,
      minQuantity,
      exchangeName,
      pairing
    ) {
      function calcIntervals(days) {
        const minutes = Number(days) * 24 * 60 * 60
        return minutes
      }
      const intervals = calcIntervals(days)

      async function getAmount(amount, interval, minQuantity) {
        const rand = Math.floor(Math.random() * Math.floor(10))
        const orderAmount = (amount / interval) * rand
        if (orderAmount < minQuantity) {
          return minQuantity
        }
        return orderAmount
      }
      const orderAmount = await getAmount(amount, intervals, minQuantity)

      const order = {
        exchangeName: exchangeName,
        asset: asset,
        amount: orderAmount,
        pairing: pairing,
      }
      return order
    }

    // Generate random number between 0 and 1 minutes
    function generateRandTime() {
      // return Math.floor(Math.random() * Math.floor(60 * 1000))
      // for testing
      return Math.floor(Math.random() * Math.floor(10000))
    }
    const go = true
    while (go) {
      const order = await generateOrder(
        days,
        amount,
        minQuantity,
        exchangeName,
        pairing
      )
      function wait() {
        return new Promise((resolve, reject) => {
          setTimeout(
            (order) => {
              return resolve(
                console.log('pushing order to exchange'),
                console.log(order),
                exchange.marketSell(order)
              )
            },
            generateRandTime(),
            order
          )
        })
      }
      await wait()
    }
  },
}

module.exports = smartScaleout
