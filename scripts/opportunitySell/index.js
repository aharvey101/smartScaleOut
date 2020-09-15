const exchange = require('../exchange')
const talib = require('talib')

// Input:
// asset
// pairing
// exchange Name
// timeframe to get 

const opportunitySell = {}

opportunitySell.start = async (input) => {

  // loop variables:
  // array for keeping slices:
  const orderBookVolume = []
  const orderBookVolumeEMA = []

  // start loop
  // - [X] 1. Take slices of order book at certain intervals (5min/15min? long run 5sec/10sec testing)
  while(true){
    
    //get order book every 5 seconds
    async function getOrderBook(input) {
      const orderBook = await exchange.getOrderBook(input.asset, input.pairing, input.exchangeName, input.limit).then(res=>(res))
      return orderBook
    }
    async function getCandles(input) {
      const candles = await exchange.getCandles(input.asset, input.pairing,input.exchangeName, input.timeframe, input.limit).then(candles => (candles))
      return candles
    }
    async function waitCandles(input) { return new Promise((res)=>setTimeout((input)=>res(getCandles(input)),100, input))}
    async function waitOrderBook(input) {return new Promise(resolve => setTimeout((input) => resolve(getOrderBook(input)),110, input))}
    // get  orderbook
    const orderBook = await waitOrderBook(input)
    // GET 
    // take out volume from orderbook
    function removeVolume(orderBook) {
      const noVol = orderBook.map(order => {
        return order[0]
      })
      return noVol
      // console.log('noVol is',noVol)
    }
    const orderBookPrices = removeVolume(orderBook.asks) 

      //get Candles
    const rawCandles = await waitCandles(input)
    // convert candle data to talib ready
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
      // calculate 1 atr from current candle
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

    // - [x] 2. Use Average true range to take a slice of the order book

    // calcualte order book atr price 

    const getATRPrice = (rawCandles, lastTrueRange, orderBookATR) =>{
      const orderBookATRPrice = rawCandles[0][3] - (lastTrueRange* orderBookATR)
    }

    const atrPrice = getATRPrice(rawCandles, lastTrueRange, input.orderBookATR)

    function rangedOrderBook(orderBook, atrPrice  ){
      // find index in orderBook array of price that is greater than orderBookATRPrice  
      const elementNumber = orderBook.findIndex((element) => (element[0] < atrPrice))
      const slice = orderBook.slice(0, elementNumber)
      return slice
    }
    const orderBookSlice = rangedOrderBook(orderBook.bids, atrPrice)
    // add up all volume in the orderBook Slice and push that into the array
    function addUpVolume(orderBookSlice){
      // for every element in the slice
      const volumeArr = orderBookSlice.map(slice => (slice[1]))
      const totalVolume = volumeArr.reduce((a, b) => a + b, 0)
      return totalVolume
    }
    const sliceTotalVolume = addUpVolume(orderBookSlice)

    orderBookVolume.unshift(sliceTotalVolume)

    // 3. Calculate order book total sliced volume exponential moving average
    if(orderBookVolume.length > 14){
      // calculate 14 period MA
      const ema = talib.execute({
        name:"EMA",
        startIdx: 0,
        endIdx: orderBookVolume.length -1,
        inReal: orderBookVolume,
        optInTimePeriod: 14,
      })
      orderBookVolumeEMA.unshift(ema.result.outReal[0]);
    }
    // 4. Calculate an offset value (ATR?EMAx2?) of slices to be used as a trigger
      // ema x 2
      const triggerEMA = orderBookVolume[1] * input.triggerEMAMultiple

    // 5. When triggered, gobble up the slice of the orderbook
    //   if orderbook volume exceeds trigger, use limit order to eat order book
        if(orderBookVolume[0] > triggerEMA){
          input.amount = (orderBookVolume[0] * 1.1)
          input.price = atrPrice
          //  create buy order down to atrPrice
          exchange.limitBuyOrder(input).then(orderId=>{
            const openOrders = await exchange.getOpenOrders(input.asset, input.pairing, input.exchangeName, orderId)
            
          })
        }
    
    // 6. Cancel all orders not filled
    //   check for order using ID
    //    - function cancel current orders, 
    // 7. After the orderbook has been eaten, place a small order at the top of the order book and market buy a small amount
    // function placeTwoOrders()
    
  }
}


module.exports = opportunitySell