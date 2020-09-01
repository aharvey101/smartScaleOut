const exchange = require('./exchange')


// Bot Logic:
// get total amount from exchange
// get percentage of that amount
// build up that amount to make a random amount
// use that amount as amount for order
// push order to exchange at random invertals between 0 and 1 minutes
//

const smartScaleout = {

start: async (asset, exchangeName, days, amount) =>{


  // Possible change, Amount to sell over time, generate random amounts
  // get days
  // get amount
  // get intervals
  // devide amount by intervals times rand between 0 and 10

  function calcIntervals(days){
    const minutes = Number(days) * 24 * 60 * 60
    console.log('minute intervals is ', minutes)
    return minutes
  }

  const intervals = calcIntervals(days)

  async function getAmount(amount, intervals){
  const orderAmount = amount / intervals * rand
  const rand = Math.floor(Math.random() * Math.floor(10))
  return orderAmount
}
const orderAmount = await getAmount(amount, intervals)

const order = {
  asset: asset,
  amount: orderAmount
}

console.log('order is', order)

  // Generate random number between 0 and 1 minutes
function generateRandTime(){
  return Math.floor(Math.random() * Math.floor(60000))
}
  const go = true
  while (go) {
    function wait(){
      return new Promise((resolve, reject) =>{
            setTimeout((exchangeName) => {
            return resolve (
              console.log('pushing order to exchange'),
              exchange.sell(exchangeName, order ))
          }, generateRandTime(), exchangeName) 
      })
    }
   await wait()
  }
}
}

module.exports = smartScaleout