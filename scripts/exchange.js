const bitmax = require('./exchanges/bitmax')
const bithumbPro = require('./exchanges/bithumbPro')
const bitmex = require('./exchanges/bitmex')

const exchange = {}
exchange.marketSell = async (order) => {
  // console.log('exchangeName', order.exchangeName);
  if(order.exchangeName === 'bithumbPro'){
    console.log('selling on', order.exchangeName);
    const res = await bithumbPro.marketSell(order)
    .then(res => (res))
    return res
  } else if(order.exchangeName === 'bitmax' ) {
    console.log('selling on', order.exchangeName)
    bitmax.marketSell(order)
  } else if(order.exchangeName === 'bitmex'){
    console.log('selling on', order.exchangeName)
    bitmex.marketSell(order)
  }
}

exchange.marketBuy = async (order) =>{
    if(order.exchangeName === 'bithumbPro'){
      // not implimented yet
      // const res = await bithumbPro.marketBuy(order)
      // .then(res => (res))
      // return res
      return
    } else if(order.exchangeName === 'bitmax' ) {
      console.log('selling on', order.exchangeName)
      bitmax.marketBuy(order)

    } else if(order.exchangeName === 'bitmex' ) {
      console.log('selling on', order.exchangeName)
      bitmex.marketBuy(order)
    }
}

exchange.limitSellOrder = async (order) =>{

  if(order.exchangeName === 'bithumbPro'){
    console.log('Placing limit order on', order.exchangeName);
    const res = await bithumbPro.limitSell(order)
    .then(res=>(res))
    return res
  } else if(order.exchangeName === 'bitmax' ) {
    console.log('Placing limit order on', order.exchangeName)
    const res = await bitmax.limitSell(order)
    .then(res => (res))
    return res
  
  } else if(order.exchangeName === 'bitmex' ) {
    console.log('Placing limit order on', order.exchangeName)
    const res = await bitmex.limitSell(order)
    .then(res => (res))
    return res
  }
}

exchange.limitBuyOrder = async (order)=>{
  if(order.exchangeName === 'bithumbPro'){
    console.log('selling on', order.exchangeName);
    const res = await bithumbPro.limitBuy(order)
    .then(res=>(res))
    return 
  } else if(order.exchangeName === 'bitmax' ) {
    console.log('selling on', order.exchangeName)
    const res = await bitmax.limitBuy(order)
    .then(res => (res))
    return res
  
  } else if(order.exchangeName === 'bitmex' ) {
    console.log('selling on', order.exchangeName)
    const res = await bitmex.limitBuy(order)
    .then(res => (res))
    return res
  }
}

// exchange.getAmount = async (asset, exchangeName) => {
//   if(exchangeName === 'bithumbPro'){
//     console.log('getting amount from', exchangeName)
//     bithumbPro.getAmount(asset)
//   } else if(exchangeName === 'bitmax'){
//       const amount = await bitmax.getAmount(asset)
//       .then(res =>{
//         return res
//       })
//       .catch(err => console.log(err))
//       return amount
//     }
// }

exchange.getMarkets = async (asset, pairing, exchangeName)=>{
  if(exchangeName === 'bithumbPro'){
    const markets = await bithumbPro.getMarkets(asset, pairing).then(res => (res))
    return markets
  } else if(exchangeName === 'bitmax'){
    const response = await bitmax.getMarkets(asset, pairing).then(response => (response))
    return response

  } else if(exchangeName === 'bitmex'){
    const response = await bitmex.getMarkets(asset, pairing).then(response => (response))
    return response
  }
}

exchange.getAskPrice = async (asset,limit, exchangeName, pairing) => {
 
    if(exchangeName === 'bithumbPro'){
      console.log('selling on', exchangeName);
      const price = await bithumbPro.getAskPrice(asset, pairing).then(res => (res))
      return price
    } else if(exchangeName === 'bitmax' ) {
     const price = await bitmax.getAskPrice(asset, limit, pairing).then(res => (res))
     return price
    } else if(exchangeName === 'bitmex' ) {
     const price = await bitmex.getAskPrice(asset, limit, pairing).then(res => (res))
     return price
    }
}

// exchange.minTick = async (asset, pairing, exchangeName) =>{
//   if(exchangeName === 'bithumbPro'){
//     console.log('not supported yet')
//     return
//   } else if(exchangeName === 'bitmax'){
//     const response = await bitmax.minTick(asset, pairing).then(response => (response))
//     return response
//   }
// }

exchange.getMinQuantity = async (exchangeName, asset, pairing) =>{
  if(exchangeName === 'bithumbPro') {
    const minQuantity = await bithumbPro.getMinQuantity(asset, pairing).then(res=>(res))
    return minQuantity
  } else if(exchangeName === 'bitmax'){
    const minQuantity = await bitmax.getMinQuantity(asset, pairing)
    return minQuantity
  }
}

exchange.cancelOrders = async (asset, exchangeName, pairing, orderId) => {
  if(exchangeName === 'bithumbPro'){
    console.log('cancelling order on', asset)
    const response = await bithumbPro.cancelOrders(asset, pairing, orderId)
    .then(res=>(res))
    return response
  } else if(exchangeName === 'bitmax' ){
    const response = await bitmax.cancelOrders(asset, pairing, orderId);
    return response
  } else if(exchangeName === 'bitmex' ){
    const response = await bitmex.cancelOrders(asset, pairing, orderId);
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
  } else if(exchangeName === 'bitmex') {
    console.log(`getting ${limit} candles from ${exchangeName}`);
    const candles = await bitmex.getCandles(asset, pairing, timeframe, limit).then(res =>(res))
    return candles
  }
}

exchange.getOrderBook = async (asset, pairing, exchangeName, limit) => {
    if(exchangeName === 'bithumbPro'){
      console.log('Getting Canndles from', exchangeName);
      const price = await bithumbPro.orderBook(asset, pairing)
      return price
    } else if(exchangeName === 'bitmax' ) {
      console.log('Getting Canndles from', exchangeName);
      const price = await bitmax.orderBook(asset, pairing, limit)
      return price
    } else if(exchangeName === 'bitmex' ) {
      console.log('Getting Canndles from', exchangeName);
      const price = await bitmex.orderBook(asset, pairing, limit)
      return price
    }
  }
exchange.getOrderStatus = async(asset, pairing, exchangeName, orderId) =>{
  if(exchangeName === 'bithumbPro'){
    const status = await bithumbPro.getOrderStatus(orderId,asset, pairing)
    return status
  } else if(exchangeName === 'bitmax' ) {
   const price = await bitmax.getOrderStatus(orderId,asset, pairing)
   return price
  
  } else if(exchangeName === 'bitmex' ) {
   const price = await bitmex.getOrderStatus(asset, pairing, orderId)
   return price
  }
}

module.exports = exchange

