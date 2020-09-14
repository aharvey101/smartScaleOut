## Smart Scaleout Bot

Routes:

/smartScaleOut : bot 2; simple scaleout bot that starts a loop that continuiosly sells a portion of what is on the exchange for the asset. Accepts an asset and exchange parameter.


## TO DO:

 - [] Bithumb, still not posting orders - "not ennough in account"
 - [x] Rename everything bithumb to bithumbPro
 - [] Test all strategies
  - [x] smartSell
    - [x] bitmax
    - [x] bithumbPro
  - [x] smartPeriodicSell
    - [x] bitmax,
    - [x] bithumbPro
  - [] atrBot
    - [x] bitmax,
    - [x] bithumbPro
  - [] OpportunitySell
    - [] bitmax
    - [] bithumbPro

## TODO SmartSell:

- [x] Cancel orders on order ID basis, not symbol wide basis
- [] Add min tick to order price so that the order is sitting at the front of the order book
- [] 

## TODO atrBot:

- [x] How to set amount? Average volume over last 50 candles
- [] Increase amount if price is spiking up
- [x] doesn't cancel orders correctly
- [x] atr is too high, workout why
- [x] Get candles
- [x] Convert candles array into array of objects
- [x] build ATR calculation
- [x] Apply calculation to candles array
- [x] Update calculation upon every new candle
- [x] Update orders upon ATR Update

## TODO: OpportunitySell