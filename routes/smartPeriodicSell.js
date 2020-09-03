const express = require('express')
const router = express.Router()

const smartPeriodicSell = require('../scripts/smartScaleout/smartPeriodicSell')
router.post('/', function (req, res){
  // get body from request

  const data = req.body
  smartPeriodicSell.start(data)
  res.send('recieved order')
})

module.exports = router