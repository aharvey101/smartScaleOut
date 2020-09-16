## Smart Scaleout Bot

Routes:

/smartScaleOut : bot 2; simple scaleout bot that starts a loop that continuiosly sells a portion of what is on the exchange for the asset. Accepts an asset and exchange parameter.


## TO DO:

 - [x] Bithumb, still not posting orders - "not ennough in account"
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

  - [] Convert bitmax functions to bitmex
  - [] BithumbPro market buy not built

## TODO SmartSell:

- [x] Cancel orders on order ID basis, not symbol wide basis
- [] Add min tick to order price so that the order is sitting at the front of the order book
- [] 

## TODO atrBot:
- [] Increase amount if price is spiking up


## TODO: OpportunitySell

- [] Use bitmex test environment ot test
- [] Impliment bithumbPro order types
  - [] limitBuyOrder
  - [] marketBuy
- [] 5.
- [] 6.
- [] Test 
- [] Graph