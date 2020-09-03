// const bithumb = require('../exchanges/bithumb')
const bitmax = require('./exchanges/bitmax')

const exchange = {}
exchange.marketSell = (order) => {
  // console.log('exchangeName', order.exchangeName);
  if(order.exchangeName === 'bithumb'){
    console.log('exchange not supported yet')
    // console.log('selling on', exchangeName);
    // bithumb.sell(order)
  } else if(order.exchangeName === 'bitmax' ) {
    console.log('selling on', order.exchangeName)
    bitmax.marketSell(order)
  }
}

exchange.getAmount = async (asset, exchangeName) => {
  if(exchangeName === 'bithumb'){
    console.log('getting amount from', exchangeName)
    console.log('this exchange is not supported yet')
  } else if(exchangeName === 'bitmax'){
      const amount = await bitmax.getAmount(asset)
      .then(res =>{
        return res
      })
      .catch(err => console.log(err))
      return amount
    }
}

exchange.getMarkets = (exchangeName)=>{
  if('exchangeName' === bithumb){
    console.log('not supported yet')
    return
  } else if(exchangeName === 'bitmax'){

  }
}

exchange.getPrice = (asset,limit, exchangeName, pairing) => {
    console.log('exchangeName', order.exchangeName);
    if(exchangeName === 'bithumb'){
      console.log('exchange not supported yet')
      // console.log('selling on', exchangeName);
      // bithumb.sell(order)
    } else if(exchangeName === 'bitmax' ) {
      bitmax.getPrice(asset, limit, pairing)
    }
}

exchange.getMinQauntity = async (exchangeName, asset) =>{
  const minQuantity = await bitmax.getMinQauntity(asset)
  return minQuantity
}

module.exports = exchange

