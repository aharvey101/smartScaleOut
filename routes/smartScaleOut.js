const express = require('express')
const router = express.Router()

const smartScaleout = require('../scripts/smartScaleout/smartScaleOut')
router.post('/', function (req, res){
  // get body from request
  const asset = req.body.asset
  const exchange = req.body.exchange
  const days = req.body.days
  const amount = req.body.amount
  smartScaleout.start(asset, exchange, days, amount)
  res.send('recieved order')
})

module.exports = router