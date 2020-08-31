const exchange = require('./exchange')


// Bot Logic:
// get total amount from exchange
// get percentage of that amount
// build up that amount to make a random amount
// use that amount as amount for order
// push order to exchange at random invertals between 0 and 1 minutes
//

const smartScaleout = {

start: async (asset, exchangeName) =>{
function getAmount(asset){
  const exchAmount = exchange.getAmount(asset)
  const rand = Math.floor(Math.random() * Math.floor(10))
  const amount = (exchAmount * 0.01) * rand
  console.log(amount)
  return amount
}

const order = {
  pair: asset + '-USDT',
  amount: getAmount()
}

  // Generate random number between 0 and 15 minutes
function generateRandTime(){
  return Math.floor(Math.random() * Math.floor(6000))
}
  const go = true
  while (go) {
    function wait(){
      return new Promise((resolve, reject) =>{
            setTimeout(() => {
            return resolve (
              console.log('doin stuff'),
              exchange.sell(exchangeName, order ))
          }, generateRandTime()) 
      })
    }
 
  }
}
}

module.exports = smartScaleout