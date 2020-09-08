const router = require('express').Router();
const atrBot = require('../scripts/atrBot/')

router.post('/', function(req, res){
const order = req.body
atrBot.start(order)

res.send('starting ATR Bot')
})


module.exports = router
