// const bithumb = require('../exchanges/bithumb')
const bitmax = require('../exchanges/bitmax')

const exchange = {}
exchange.sell = (exchangeName, order) => {
  console.log('exchangeName', exchangeName, order);
  // if(exchangeName === 'bithumb'){
  //   console.log('exchange not supported yet')
  //   // console.log('selling on', exchangeName);
  //   // bithumb.sell(order)
  // } else if(exchangeName === 'bitmax' ) {
  //   console.log('selling on', exchangeName)
  //   bitmax.sell(order)
  // }
  bitmax.sell(order)
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

exchange.getMinQauntity = async (exchangeName, asset) =>{
  const minQuantity = await bitmax.getMinQauntity(asset)
  return minQuantity
}

module.exports = exchange

