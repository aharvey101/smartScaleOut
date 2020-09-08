## Smart Scaleout Bot

Routes:

/smartScaleOut : bot 2; simple scaleout bot that starts a loop that continuiosly sells a portion of what is on the exchange for the asset. Accepts an asset and exchange parameter.


## TO DO:

 - [] Bithumb, still not posting orders - "not ennough in account"
 - [] Reame everything bithumb to bithumbPro

## TODO SmartSell:

- [] Cancel orders on order ID basis, not symbol wide basis
- [] Add min tick to order price so that the order is sitting at the front of the order book
- [] 

## TODO atrBot:

- [] Get candles
- [] Convert candles array into array of objects
- [] build ATR calculation
- [] Apply calculation to candles array
- [] Update calculation upon every new candle
- [] Update orders upon ATR Update