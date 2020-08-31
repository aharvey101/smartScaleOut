const bithumb = require('../exchanges/bithumb')
const bitmax = require('../exchanges/bitmax')

const exchange = {}
exchange.sell = (exchangeName, order) => {
  if(exchangeName === 'bithumb'){
    bithumb.sell(order)
  } else if(exchangeName === 'bitmax' ) {
    bitmax.sell(order)
  }
}

exchange.getAmount = (exchangeName, asset) => {
  if(exchangeName === 'bithumb'){
    const amount = bithumb.getAmount()
    return amount
  }
}

module.exports = exchange

