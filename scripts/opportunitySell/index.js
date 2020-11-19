const exchange = require('../exchange')
const talib = require('talib')

const createCsvWriter = require('csv-writer').createObjectCsvWriter

// example input:
// {
//   "asset": "BTC",
//   "pairing": "USD",
//   "exchangeName": "bitmex",
//   "timeframe": "1h",
//   "amount": 1,
//   "limit": 500,
//   "triggerEMAMultiple": 1.25,
//   "atrMultiple": 4,
//   "msToCancelLimitSell": 1000
// }

// Input:
// asset
// pairing
// exchange Name
// timeframe to get
//

const opportunitySell = {}

opportunitySell.start = async (input) => {
  function exportToCsv(
    rawCandles,
    atrData,
    orderBookVolume,
    volumeEMA,
    triggerEMA,
    atrMultiple
  ) {
    const atrd = atrData.result.outReal
    function oneATRBelowPrice(rawCandles, atrData) {
      const arr = atrData.map((atr, index) => {
        return (
          (rawCandles[index][2] + rawCandles[index][3]) / 2 - atr * atrMultiple
        )
      })
      return arr
    }

    const lineBelowPrice = oneATRBelowPrice(rawCandles, atrd)

    // const rangeData = trueRange.result.outReal
    const csvWriter = createCsvWriter({
      path: `./out.csv`,
      header: [
        { id: 'timestamp', title: 'TIMESTAMP' },
        { id: 'open', title: 'OPEN' },
        { id: 'high', title: 'HIGH' },
        { id: 'low', title: 'LOW' },
        { id: 'close', title: 'CLOSE' },
        { id: 'volume', title: 'VOLUME' },
        { id: 'orderBookVolume', title: 'ORDER_BOOK_VOLUME' },
        { id: 'atr', title: 'ATR' },
        { id: 'volumeEMA', title: 'VOLUME_EMA' },
        { id: 'triggerEMA', title: 'TRIGGER_EMA' },
      ],
    })

    const convertCSV = (
      candleData,
      lineBelowPrice,
      orderBookVolume,
      volumeEMA,
      triggerEMA
    ) => {
      const newCandleData = candleData.slice(0, atrData.length)
      const rows = newCandleData.map((candle, index) => {
        return {
          timestamp: candle[0],
          open: candle[1],
          high: candle[2],
          low: candle[3],
          close: candle[4],
          volume: candle[5],
          orderBookVolume: orderBookVolume[index],
          atr: lineBelowPrice[index],
          volumeEMA: volumeEMA[index],
          triggerEMA: triggerEMA[index],
        }
      })
      return rows
    }

    const csvReady = convertCSV(
      rawCandles,
      lineBelowPrice,
      orderBookVolume,
      volumeEMA,
      triggerEMA
    )

    csvWriter
      .writeRecords(csvReady)
      .then(() => console.log('done writing record'))
  }

  // loop variables:
  // array for keeping slices:
  const orderBookVolume = []
  const orderBookVolumeEMA = []
  const triggerEMAArray = []

  // start loop
  // - [X] 1. Take slices of order book at certain intervals (5min/15min? long run 5sec/10sec testing)
  while (true) {
    //get order book every 5 seconds
    async function getOrderBook(input) {
      const orderBook = await exchange
        .getOrderBook(
          input.asset,
          input.pairing,
          input.exchangeName,
          input.limit
        )
        .then((res) => res)
      return orderBook
    }
    async function getCandles(input) {
      const candles = await exchange
        .getCandles(
          input.asset,
          input.pairing,
          input.exchangeName,
          input.timeframe,
          input.limit
        )
        .then((candles) => candles)
      return candles
    }
    async function waitCandles(input) {
      return new Promise((res) =>
        setTimeout((input) => res(getCandles(input)), 100, input)
      )
    }
    async function waitOrderBook(input) {
      return new Promise((resolve) =>
        setTimeout((input) => resolve(getOrderBook(input)), 110, input)
      )
    }
    // get  orderbook
    const orderBook = await waitOrderBook(input)
    // GET

    //get Candles
    const rawCandles = await waitCandles(input)
    // convert candle data to talib ready
    // convert candles to talib style
    async function convert(candles) {
      const open = candles.map((candle) => candle[1])
      const high = candles.map((candle) => candle[2])
      const low = candles.map((candle) => candle[3])
      const close = candles.map((candle) => candle[4])
      const candleObj = { open: open, high: high, low: low, close: close }
      return candleObj
    }
    //----------------------------------------------------------------
    const talibData = await convert(rawCandles)
    // calculate 1 atr from current candle
    function talibATR(talibData) {
      return talib.execute({
        name: 'ATR',
        startIdx: 0,
        endIdx: talibData.close.length - 1,
        high: talibData.high,
        low: talibData.low,
        close: talibData.close,
        optInTimePeriod: 14,
      })
    }
    const trueRange = talibATR(talibData)
    const lastTrueRange = trueRange.result.outReal[0]

    // - [x] 2. Use Average true range to take a slice of the order book

    // calcualte order book atr price

    const getATRPrice = (rawCandles, lastTrueRange, orderBookATR) => {
      const orderBookATRPrice = rawCandles[0][3] - lastTrueRange * orderBookATR
      return orderBookATRPrice
    }

    const atrPrice = getATRPrice(rawCandles, lastTrueRange, input.atrMultiple)

    function rangedOrderBook(orderBookBids, atrPrice) {
      // find index in orderBook array of price that is greater than orderBookATRPrice
      const elementNumber = orderBookBids.findIndex(
        (element) => element[0] < atrPrice
      )
      const slice = orderBookBids.slice(0, elementNumber)
      return slice
    }
    const orderBookSlice = rangedOrderBook(orderBook.bids, atrPrice)
    // add up all volume in the orderBook Slice and push that into the array
    function addUpVolume(orderBookSlice) {
      // for every element in the slice
      const volumeArr = orderBookSlice.map((slice) => slice[1])
      const totalVolume = volumeArr.reduce((a, b) => a + b, 0)
      return totalVolume
    }
    const sliceTotalVolume = addUpVolume(orderBookSlice)

    orderBookVolume.unshift(sliceTotalVolume)

    // 3. Calculate order book total sliced volume exponential moving average
    if (orderBookVolume.length > 14) {
      // calculate 14 period MA
      const ema = talib.execute({
        name: 'EMA',
        startIdx: 0,
        endIdx: orderBookVolume.length - 1,
        inReal: orderBookVolume,
        optInTimePeriod: 14,
      })
      orderBookVolumeEMA.unshift(ema.result.outReal[0])
      // calculate trigger EMA
      const triggerEMA = orderBookVolumeEMA[0] * input.triggerEMAMultiple
      triggerEMAArray.unshift(triggerEMA)
    }

    // 4. Calculate an offset value (ATR?EMAx2?) of slices to be used as a trigger
    // ema x 2

    // 4.1 export to csv
    exportToCsv(
      rawCandles,
      trueRange,
      orderBookVolume,
      orderBookVolumeEMA,
      triggerEMAArray,
      input.atrMultiple
    )

    // 5. When triggered, gobble up the slice of the orderbook
    //   if orderbook volume exceeds trigger, use limit order to eat order book
    if (orderBookVolume[0] > triggerEMAArray[0]) {
      input.amount = orderBookVolume[0] * 1.1
      input.price = atrPrice
      //  create buy order down to atrPrice
      exchange.limitBuyOrder(input).then((orderId) => {
        // check if order is still open after sometime (0.5 seconds?)
        setTimeout(
          async (orderId, input) => {
            const orderStatus = await exchange.getOrderStatus(
              input.asset,
              input.pairing,
              input.exchangeName,
              orderId
            )
            // - [] 6. Cancel order not filled
            // if order is still open, cancel order
            if (orderStatus != 'Filled') {
              const res = await exchange
                .cancelOrders(
                  input.asset,
                  input.exchangeName,
                  input.pairing,
                  orderId
                )
                .then((res) => res)
            } else {
              console.log('order successfully filled')
            }
          },
          input.msToCancelLimitSell,
          orderId,
          input
        )
        // then
        // - [] 7. After the orderbook has been eaten, place a small order at the top of the order book and market buy a small amount
        setTimeout(
          async (input) => {
            // place tiny market buy? (0.001% of ema volume?)
            const amount = orderBookVolumeEMA * 0.00001
            const marketOrder = {
              asset: input.asset,
              pairing: input.pairing,
              exchange: input.exchangeName,
              amount: amount,
            }
            const marketBuyResponse = await exchange
              .marketBuy(marketOrder)
              .then((res) => res)

            // place tiny order at the top of the bids side of the order book
            const limitOrder = {
              asset: input.asset,
              pairing: input.pairing,
              exchange: input.exchangeName,
              amount: amount,
              // price: exchange.bestAskPrice()
            }

            const limitBuyResponse = await exchange.limitBuyOrder(order)
          },
          1000,
          input
        )
      })
    }
  }
}

module.exports = opportunitySell
