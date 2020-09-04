const exchange = require('../scripts/exchange.js')

const order = { 
  asset: "BTC",
  exchangeName: "bitmax",
  pairing: "USDT"
}

test('expect response, orders cancelled', async (order) => {
  const response = await exchange.cancelOrders(order)
  console.log(response)
  expect(response)
}
)