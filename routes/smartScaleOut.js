const express = require('express')
const router = express.Router()

const smartScaleout = require('../scripts/smartScaleout/smartScaleOut')
router.post('/', function (req, res){
  // get body from request
  const asset = req.body.order
  const exchange = req.body.exchange
  smartScaleout.start(exchange, asset)
  res.send('recieved order')
})

module.exports = router