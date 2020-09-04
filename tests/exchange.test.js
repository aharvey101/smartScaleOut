const exchange = require('../scripts/exchange.js')

const order = { 
  asset: "BTC",
  exchangeName: "bitmax",
  pairing: "USDT",
  amount: 0.001
}

// test('expect response, orders cancelled', async (order) => {
//   const response = await exchange.cancelOrders(order)
//   console.log(response)
//   expect(response)
// }
// )

test('expect limit order to work', async (order)=>{
  const response = exchange.limitOrder(order)
  expect(response)
})