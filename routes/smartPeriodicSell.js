const express = require('express')
const router = express.Router()

const smartPeriodicSell = require('../scripts/smartScaleout/smartPeriodicSell')
router.post('/', function (req, res){


  const data = req.body
  console.log(data)
  smartPeriodicSell.start(data)
  res.send('recieved order, startingSmartPeriodicSell')
})

module.exports = router