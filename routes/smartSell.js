const express = require('express')
const router = express.Router()
const smartSell = require('../scripts/smartSell/smartSell')

router.post('/', async (req, res) => {
  // provide asset, exchangeName, days, amount
  const data = req.body
  smartSell.start(data)
  res.send('recieved order, starting smartSell bot')
})

module.exports = router