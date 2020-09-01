const exchange = require('./exchange')
// Bot Logic:

const smartScaleout = {

start: async (asset, exchangeName, days, amount) =>{
  // get days
  // get amount
  // get intervals
  // devide amount by intervals times rand between 0 and 10
  // if orderAmount in getAmount is lower than exchange min quantity, times by 10?
  
  async function getMinQauntity(exchangeName, asset){
    const minQuantity = await exchange.getMinQauntity(exchangeName, asset)
    console.log(minQuantity)
  }
  const minQuantity = await getMinQauntity(exchangeName, asset)

async function generateOrder(days, amount, minQuantity){
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
    amount: orderAmount
  }
  return order
}

  // Generate random number between 0 and 1 minutes
function generateRandTime(){
  return Math.floor(Math.random() * Math.floor(10000))
}
  const go = true
  while (go) {
    const order = await generateOrder(days, amount, minQuantity)

    function wait(){
      return new Promise((resolve, reject) =>{
            setTimeout((exchangeName, order) => {
            return resolve (
              console.log('pushing order to exchange'),
              exchange.sell(exchangeName, order ))
          }, generateRandTime(),exchangeName, order) 
      })
    }
   await wait()
  }
}
}

module.exports = smartScaleout