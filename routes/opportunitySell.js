const router = require('express').Router()
const opportunitySell = require('../scripts/opportunitySell/')

router.post('/', function(req, res) {
  const input = req.body

  opportunitySell.start(input)

})

module.exports = router