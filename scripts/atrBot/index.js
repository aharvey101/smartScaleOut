const exchange = require('../exchange')
const talib = require('talib')
const atrBot = {}

atrBot.start = async (input) => {
  // get Candles
  async function getCandles(input) {
    const candles = await exchange.getCandles(input.asset, input.pairing, input.exchangeName, input.timeframe, 50)
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
  
  function talibATR(talibData) {
    return talib.execute({
      name: "ATR",
      startIdx: 0,
      endIdx: talibData.close.length -1,
      high: talibData.high,
      low: talibData.low,
      close: talibData.close,
      optInTimePeriod: 14
    })
  }
  const trueRange = talibATR(talibData)
  const lastTrueRange = trueRange.result.outReal[0]
  
  function createLimitOrder(minQuantity, input, price){
    const amount = input.amount * 0.1
    const order = {
      asset: input.asset,
      pairing: input.pairing,
      amount: amount < minQuantity ? minQuantity : amount,
      price: price,
      exchangeName: input.exchangeName
    }
    return order
  }
  
  // calculate limit order prices using lastTrueRange
  function createPrice(price, ltr, multiplier) {
    return price + (ltr * multiplier)
  }

  // get minQuantity
  const minQuantity = await exchange.getMinQuantity(input.exchangeName, input.asset, input.pairing)
  function createLimitOrderArray(number, price, lastTrueRange) {
    const array = []
    for (let i = 0; i < number; i++) {
      const limitOrder = createLimitOrder(minQuantity,input, createPrice(price,lastTrueRange,[i]))
      array.push(limitOrder)
    }
    return array
  }
  // create 10 limit orders 

  const price = rawCandles[0][2]



  const ordersArray =  createLimitOrderArray(10, price, lastTrueRange)

  const ordersIdArray = []

  // post orders 
  ordersArray.forEach(async(order) => {
    const orderId = await exchange.limitOrder(order).then(res => (res))
    //push order id's to array
    ordersIdArray.push(orderId)
  })
  console.log(ordersArray)
  // --------------------------------
  //   initial orders created 
  // --------------------------------

  // watch and create new orders when input timeframe candle closes

  while(true) {
     // calculate how many milliseconds left til each asset's period closes (UTC midnight used as base reference):
    const now = new Date()
    const utcMidnight = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    const millisecondsSinceUTCMidnight = now.getTime() - utcMidnight.getTime()
  console.log(utcMidnight)
    let millisecondsToWait = 0
    // 15 minutes
    // const thisPeriodMilliseconds = 15 * 60 * 1000
    // 1 minute
    const thisPeriodMilliseconds = 60000
    millisecondsToWait = thisPeriodMilliseconds - (millisecondsSinceUTCMidnight % thisPeriodMilliseconds)

    // wait a little bit longer as exchanges take a little bit to 'wrap up' the most recent candle
    millisecondsToWait += 1500; // 1500ms

    // 2. PAUSE / SLEEP UNTIL CANDLE HAS CLOSED
    console.log('waiting for', Math.floor(millisecondsToWait/1000), 'seconds')
    // await new Promise(r => setTimeout(r, millisecondsToWait));

    function wait (){
      return new Promise(r => setTimeout(r, millisecondsToWait));
    }
    await wait()
    //wait, then do recalculate orders
    .then(async () =>{
      // cancel orders on pair
      console.log(ordersIdArray);
      ordersIdArray.forEach(orderId=>{
        exchange.cancelOrders(input.asset,input.exchangeName, input.pairing, orderId)
      })

      setTimeout(async ()=>{
             //get candles
      const candles = await getCandles(input)
      // change candles into talibData
      const talibData = await convert(candles)
      // calculate Average True Range
      const trueRange = talibATR(talibData)
      // get last candles ATR
      const lastTrueRange = trueRange.result.outReal[0]
      // create array of orders
      const ordersArray =  createLimitOrderArray(10, price, lastTrueRange)
      // execute orders
      ordersArray.forEach(async(order) => {
       const orderId = await exchange.limitOrder(order)
       ordersIdArray.pop()
       ordersIdArray.push(orderId)
      })
      console.log(ordersIdArray)
      },5000)
    })
  }



}

module.exports = atrBot