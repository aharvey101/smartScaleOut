// 100 candles is enough to calculate ATR
// From that get 14 period ATR

// ask for 100 candles 
// 10x ATR max @ 15 min candle size
// delay 1 candle after order has been hit

// use data-forge

// Inputs: 
// - Asset,
// - 

const exchange = require('../exchange')
const talib = require('talib')
const atrBot = {}

atrBot.start = async (input) => {

  console.log(input)
  // get Candles
  async function getCandles(input) {
    const candles = await exchange.getCandles(input.asset, input.pairing, input.exchangeName, input.timeframe, input.limit || 100)
    .then(res=>(res))
    return candles
  }
  const rawCandles = await getCandles(input).then(res => (res))

  // convert candles to talib style
  async function convert(candles) {
    const open = candles.map(candle =>(candle[1]))    
    const high = candles.map(candle =>(candle[2]))
    const low = candles.map(candle =>(candle[3]))
    const close = candles.map(candle =>(candle[4]))
    const candleObj = {open: open, high: high, low: low, close: close}
    return candleObj
  }
  //----------------------------------------------------------------
  const talibData = await convert(rawCandles)
  // calculate atr
  const trueRange = talib.execute({
    name: "ATR",
    startIdx: 0,
    endIdx: talibData.close.length -1,
    high: talibData.high,
    low: talibData.low,
    close: talibData.close,
    optInTimePeriod: 14
  })


  
  // calculate limit order prices using lastTrueRange
  const lastTrueRange = trueRange.result.outReal[0]

  function createLimitOrder(input, price){
    const amount = input.amount * 0.1
    const order = {
      asset: input.asset,
      pairing: input.pairing,
      amount: amount,
      price: price,
      exchangeName: input.exchangeName
    }
    return order
  }

  function createPrice(price, multiplier) {
    return price + (lastTrueRange * multiplier)
  }

  // create 10 limit orders 
  const price = lastTrueRange + rawCandles[0][2]
  console.log(price)
  const limitOrder1 = createLimitOrder(input, price)
  const limitOrder2 = createLimitOrder(input, createPrice(price,2))
  const limitOrder3 = createLimitOrder(input, createPrice(price,2))
  const limitOrder4 = createLimitOrder(input, createPrice(price,2))
  const limitOrder5 = createLimitOrder(input, createPrice(price,2))
  const limitOrder6 = createLimitOrder(input, createPrice(price,2))
  const limitOrder7 = createLimitOrder(input, createPrice(price,2))
  const limitOrder8 = createLimitOrder(input, createPrice(price,2))
  const limitOrder9 = createLimitOrder(input, createPrice(price,2))
  const limitOrder10 = createLimitOrder(input, createPrice(price,2))

  const ordersArray =  [
    limitOrder1, 
    limitOrder2, 
    limitOrder3, 
    limitOrder4, 
    limitOrder5, 
    limitOrder6, 
    limitOrder7, 
    limitOrder8, 
    limitOrder9,
    limitOrder10
  ]

  ordersArray.forEach(order => {
    exchange.limitOrder(order)
  })
//--------------------------------
  // initial orders created 
// --------------------------------

//watch and create new orders when input timeframe candle closes

  // calculate how many milliseconds left til each asset's period closes (UTC midnight used as base reference):
  const now = new Date()
  const utcMidnight = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  const millisecondsSinceUTCMidnight = now.getTime() - utcMidnight.getTime()

  let millisecondsToWait = 0
  const thisPeriodMilliseconds = 15 * 60 * 1000
  millisecondsToWait = thisPeriodMilliseconds - (millisecondsSinceUTCMidnight % thisPeriodMilliseconds)

  // wait a little bit longer as exchanges take a little bit to 'wrap up' the most recent candle
  millisecondsToWait += 1500; // 1500ms

  // 2. PAUSE / SLEEP UNTIL CANDLE HAS CLOSED
  console.log('waiting for', Math.floor(millisecondsToWait/1000), 'seconds')
  await new Promise(r => setTimeout(r, millisecondsToWait));

}

module.exports = atrBot