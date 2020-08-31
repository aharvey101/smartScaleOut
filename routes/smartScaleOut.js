const router = require('express').Router()
const smartScaleout = ('../scripts/smartScaleout')

router.post('/', function (req, res){
  // get body from request
  const order = req.body
  smartScaleout.start(order)
  res.send('recieved order')
})