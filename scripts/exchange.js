// const bithumb = require('../exchanges/bithumb')
const bitmax = require('./exchanges/bitmax')
const bithumb = require('./exchanges/bithumb')

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

exchange.limitOrder = async (order) =>{
  console.log(order)
  if(order.exchangeName === 'bithumb'){
    console.log('exchange not supported yet')
    // console.log('selling on', exchangeName);
    // bithumb.sell(order)
  } else if(order.exchangeName === 'bitmax' ) {
    console.log('selling on', order.exchangeName)
    const res = await bitmax.limitSell(order)
    .then(res => (res))
    return res
  }
}

exchange.getAmount = async (asset, exchangeName) => {
  if(exchangeName === 'bithumb'){
    console.log('getting amount from', exchangeName)
    bithumb.getAmount(asset)
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

exchange.getPrice = async (asset,limit, exchangeName, pairing) => {
 
    if(exchangeName === 'bithumb'){
      console.log('exchange not supported yet')
      // console.log('selling on', exchangeName);
      // bithumb.sell(order)
    } else if(exchangeName === 'bitmax' ) {
     const price = await bitmax.getPrice(asset, limit, pairing)
     return price
    }
}

exchange.getMinQauntity = async (exchangeName, asset, pairing) =>{
  console.log('pairing is', pairing)
  if(exchangeName === 'bithumb') {
    console.log('exchange not supported yet')
  } else if(exchangeName === 'bitmax'){
    const minQuantity = await bitmax.getMinQauntity(asset, pairing)
    console.log('min quantity', minQuantity)
    return minQuantity
  }
}

exchange.cancelOrders = async (asset, exchangeName, pairing) => {
  if(exchangeName === 'bithumb'){
    console.log('exchange not supported yet')
    // console.log('selling on', exchangeName);
    // bithumb.sell(order)
  } else if(exchangeName === 'bitmax' ){
    const response = await bitmax.cancelOrders(asset, pairing );
    return response
  }
}

module.exports = exchange

