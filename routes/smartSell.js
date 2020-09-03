const express = require('express')
const router = express.Router()
const smartSell = require('../scripts/smart-sell')

router.post('/', async (req, res) => {
  const data = req.body
  smartSell.start(data)
})