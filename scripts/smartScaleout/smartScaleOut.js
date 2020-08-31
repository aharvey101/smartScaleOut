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

  async function getAmount(asset){
  const exchAmount = await exchange.getAmount(asset)
  console.log('exch amount is', exchAmount)
  const rand = Math.floor(Math.random() * Math.floor(10))
  const amount = (exchAmount * 0.01) * rand
  console.log('amount is', amount)
  return amount
}
const amount = await getAmount(asset, exchangeName)

const order = {
  pair: asset + '-USDT',
  amount: amount
}

console.log('order is', order)

  // Generate random number between 0 and 15 minutes
function generateRandTime(){
  return Math.floor(Math.random() * Math.floor(6000))
}
  const go = true
  while (go) {
    function wait(){
      return new Promise((resolve, reject) =>{
            setTimeout((exchangeName) => {
            return resolve (
              console.log('doin stuff'),
              exchange.sell(exchangeName, order ))
          }, generateRandTime(), exchangeName) 
      })
    }
   await wait()
  }
}
}

module.exports = smartScaleout