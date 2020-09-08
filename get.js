// const bithumb = require('./scripts/extension/bithumb')
const axios = require('axios')
const bitmax = require('./scripts/exchanges/bitmax')
const exchange = require('./scripts/exchange')
const talib = require('talib')

const bithumb = require('./scripts/exchanges/bithumb')

async function atrBot () {

async function getCandles() {
  const candles = await bithumb.getCandles('BTC', 'USDT', '1m', 100).then(res=>(res))
  return candles
  }
  // convert candles array into array of objects
  const rawCandles = await getCandles()

  async function convert(candles) {
    const candlesObj = candles.map(candle =>{
      const candleObj = {
        timestamp: candle[0],
        open: candle[1],
        high: candle[2],
        low: candle[3],
        close: candle[4]
      }
      return candleObj
    })
    return candlesObj
  }
  const candlesObj = await convert(rawCandles)
  // console.log(candlesObj)
  const talibStyle = (candlesObj) => {
    const open = candlesObj.map(candle =>{
      return candle.open
    })
    const high = candlesObj.map(candle =>{
      return candle.high
    })
    const low = candlesObj.map(candle =>{
      return candle.low
    })

    const close = candlesObj.map(candle =>{
      return candle.close
    })

    const combined = {open: open, high: high, low: low, close: close}
    return combined
  }

  const c = talibStyle(candlesObj)
// console.log(c)
  const trueRange = talib.execute({
    name: "ATR",
    startIdx: 0,
    endIdx: c.close.length -1,
    high: c.high,
    low: c.low,
    close: c.close,
    optInTimePeriod: 14
  })
  console.log(trueRange)

  // const functionDesc = talib.explain("ATR")
  // console.log(functionDesc)
}
atrBot()