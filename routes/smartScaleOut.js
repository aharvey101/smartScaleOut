const express = require('express')
const router = express.Router()

const smartScaleout = require('../scripts/smartScaleout/smartScaleOut')
router.post('/', function (req, res){
  // get body from request
  const asset = req.body.asset
  const exchange = req.body.exchange
  console.log(req.body)
  smartScaleout.start(asset, exchange)
  res.send('recieved order')
})

module.exports = router