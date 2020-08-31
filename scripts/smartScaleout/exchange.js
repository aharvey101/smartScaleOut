const bithumb = require('../exchanges/bithumb')
const bitmax = require('../exchanges/bitmax')

const exchange = {}
exchange.sell = (exchangeName, order) => {
  console.log('exchangeName', exchangeName, order);
  if(exchangeName === 'bithumb'){
    console.log('selling on', exchangeName);
    bithumb.sell(order)
  } else if(exchangeName === 'bitmax' ) {
    bitmax.sell(order)
  }
}

exchange.getAmount = async (asset, exchangeName) => {
  
   const amount = await bitmax.getAmount(asset)
  .then(res => {
    return res
  })

    // return amount
    console.log('amount is', amount)
  return amount
}

module.exports = exchange

