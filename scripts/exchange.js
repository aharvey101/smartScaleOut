const bitmax = require('./exchanges/bitmax')
const bithumbPro = require('./exchanges/bithumbPro')


const exchange = {}
exchange.marketSell = (order) => {
  // console.log('exchangeName', order.exchangeName);
  if(order.exchangeName === 'bithumbPro'){
    console.log('selling on', order.exchangeName);
    bithumbPro.marketSell(order)
  } else if(order.exchangeName === 'bitmax' ) {
    console.log('selling on', order.exchangeName)
    bitmax.marketSell(order)
  }
}

exchange.limitOrder = async (order) =>{

  if(order.exchangeName === 'bithumbPro'){
    console.log('selling on', order.exchangeName);
    bithumbPro.marketSell(order)
  } else if(order.exchangeName === 'bitmax' ) {
    console.log('selling on', order.exchangeName)
    const res = await bitmax.limitSell(order)
    .then(res => (res))
    return res
  }
}

exchange.getAmount = async (asset, exchangeName) => {
  if(exchangeName === 'bithumbPro'){
    console.log('getting amount from', exchangeName)
    bithumbPro.getAmount(asset)
  } else if(exchangeName === 'bitmax'){
      const amount = await bitmax.getAmount(asset)
      .then(res =>{
        return res
      })
      .catch(err => console.log(err))
      return amount
    }
}

exchange.getMarkets = async (asset, pairing, exchangeName)=>{
  if(exchangeName === 'bithumbPro'){
    console.log('not supported yet')
    return
  } else if(exchangeName === 'bitmax'){
    const response = await bitmax.getMarkets(asset, pairing).then(response => (response))
    return response
  }
}

exchange.getPrice = async (asset,limit, exchangeName, pairing) => {
 
    if(exchangeName === 'bithumbPro'){
      console.log('exchange not supported yet')
      console.log('selling on', exchangeName);
      // bithumbPro.getPrice()
    } else if(exchangeName === 'bitmax' ) {
     const price = await bitmax.getPrice(asset, limit, pairing)
     return price
    }
}

exchange.minTick = async (asset, pairing, exchangeName) =>{
  if(exchangeName === 'bithumbPro'){
    console.log('not supported yet')
    return
  } else if(exchangeName === 'bitmax'){
    const response = await bitmax.minTick(asset, pairing).then(response => (response))
    return response
  }
}

exchange.getMinQuantity = async (exchangeName, asset, pairing) =>{
  console.log('pairing is', pairing)
  if(exchangeName === 'bithumbPro') {
    bithumbPro.getMinQuantity(asset, pairing)
  } else if(exchangeName === 'bitmax'){
    const minQuantity = await bitmax.getMinQuantity(asset, pairing)
    return minQuantity
  }
}

exchange.cancelOrders = async (asset, exchangeName, pairing) => {
  if(exchangeName === 'bithumbPro'){
    console.log('cancelling orders on', asset)
    bithumbPro.cancelOrders(asset, pairing)
  } else if(exchangeName === 'bitmax' ){
    const response = await bitmax.cancelOrders(asset, pairing );
    return response
  }
}

exchange.getCandles = async (asset, pairing,exchangeName, timeframe, limit) =>{
  if(exchangeName === 'bithumbPro'){
    console.log(`getting ${limit} candles from ${exchangeName}`);
    const candles = await bithumbPro.getCandles(asset, pairing, timeframe, limit).then(res => (res))
    return candles
  } else if(exchangeName === 'bitmax') {
    console.log(`getting ${limit} candles from ${exchangeName}`);
    const candles = await bitmax.getCandles(asset, pairing, timeframe, limit).then(res =>(res))
    return candles
  }
}

module.exports = exchange

