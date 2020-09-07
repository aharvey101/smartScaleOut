'use strict';

//  ---------------------------------------------------------------------------

const Exchange = require ('./base/Exchange');
const { ExchangeError, ExchangeNotAvailable, AuthenticationError, BadRequest, PermissionDenied, InvalidAddress, ArgumentsRequired, InvalidOrder } = require ('./base/errors');

//  ---------------------------------------------------------------------------

module.exports = class bithumbpro extends Exchange {
    describe () {
        return this.deepExtend (super.describe (), {
            'id': 'bithumbpro',
            'name': 'Bithumb.pro',
            'countries': [ 'KR', 'SG' ], 
            'rateLimit': 100,
            'has': {
                'CORS': false,
                'publicAPI': true,
                'privateAPI': true,
                // 'cancelOrder': true,
                // 'createDepositAddress': false,
                // 'createOrder': true,
                // 'deposit': false,
                'fetchBalance': true,
                // 'fetchClosedOrders': false,
                // 'fetchCurrencies': false,
                // 'fetchDepositAddress': false,
                // 'fetchMarkets': true,
                // 'fetchMyTrades': false,
                // 'fetchOHLCV': false,
                // 'fetchOpenOrders': false,
                // 'fetchOrder': false,
                'fetchOrderBook': true,
                // 'fetchOrders': false,
                // 'fetchStatus': 'emulated',
                'fetchTicker': true,
                // 'fetchTickers': false,
                // 'fetchBidsAsks': false,
                // 'fetchTrades': true,
                // 'withdraw': false,
            },
            'urls': {
                'logo': 'https://user-images.githubusercontent.com/1294454/30597177-ea800172-9d5e-11e7-804c-b9d4fa9b56b0.jpg',
                'api': {
                    'public': 'https://global-openapi.bithumb.pro/openapi/v1',
                    'private': 'https://global-openapi.bithumb.pro/openapi/v1',
                },
                'www': 'https://www.bithumb.pro/',
                'doc': 'https://github.com/bithumb-pro/bithumb.pro-official-api-docs',
                'fees': 'https://www.bithumb.pro/en-us/fee',
            },
            'api': {
                'public': {
                    'get': [
                        'serverTime',
                        'spot/config',
                        'spot/ticker',
                        'spot/orderBook',
                        'spot/trades',
                        'spot/kline'
                    ],
                },
                'private': {
                    'post': [
                        'withdraw',
                        'spot/placeOrder',
                        'spot/cancelOrder',
                        'spot/assetList', // fetchBalance
                        'spot/orderDetail',
                        'spot/orderList',
                        'spot/singleOrder',
                        'spot/openOrders',
                        'spot/myTrades',
                        'spot/cancelOrder/batch',
                        'spot/placeOrders',
                    ],
                },
            },
            'fees': {
                'trading': {
                    'maker': 0.10 / 100,
                    'taker': 0.10 / 100,
                },
            },
            'exceptions': {
                '9000' : AuthenticationError,
                '9001' : BadRequest,
                '9002' : AuthenticationError,
                '9004' : BadRequest,
                '9005' : AuthenticationError,
                '9006' : ExchangeError,
                '9007' : BadRequest,
                '9008' : BadRequest,
                '9999' : ExchangeError,
                '9010' : PermissionDenied,
                '9011' : PermissionDenied,
                '9012' : PermissionDenied,
                '20000' : BadRequest,
                '20002' : PermissionDenied,
                '20003' : InvalidOrder,
                '20004' : InvalidOrder,
                '20010' : InvalidOrder,
                '20012' : ExchangeError,
                '20043' : InvalidOrder,
                '20044' : InvalidOrder,
                '20048' : InvalidOrder,
                '20053' : PermissionDenied,
                '20054' : InvalidOrder,
                '20056' : InvalidOrder,

                // 'Bad Request(SSL)': BadRequest,
                // 'Bad Request(Bad Method)': BadRequest,
                // 'Bad Request.(Auth Data)': AuthenticationError, // { "status": "5100", "message": "Bad Request.(Auth Data)" }
                // 'Not Member': AuthenticationError,
                // 'Invalid Apikey': AuthenticationError, // {"status":"5300","message":"Invalid Apikey"}
                // 'Method Not Allowed.(Access IP)': PermissionDenied,
                // 'Method Not Allowed.(BTC Adress)': InvalidAddress,
                // 'Method Not Allowed.(Access)': PermissionDenied,
                // 'Database Fail': ExchangeNotAvailable,
                // 'Invalid Parameter': BadRequest,
                // '5600': ExchangeError,
                // 'Unknown Error': ExchangeError,
                // 'After May 23th, recent_transactions is no longer, hence users will not be able to connect to recent_transactions': ExchangeError, // {"status":"5100","message":"After May 23th, recent_transactions is no longer, hence users will not be able to connect to recent_transactions"}
            },
        });
    }

    async fetchMarkets (params = {}) {
        const response = await this.publicGetSpotConfig (params);
        const data = this.safeValue (response, 'data');

        const result = [];
        for (let i = 0; i < data.spotConfig.length; i++) {
            const symbolParts = data.spotConfig[i].symbol.split('-');
            const currencyId = symbolParts[0];
            const quote = symbolParts[1];
            const base = currencyId;
            const symbol = currencyId + '/' + quote;
            let active = true;

            let coinConfig = {}
            for (let j=0; j < data.coinConfig.length; j++ ) {
                if (data.coinConfig[j].name == currencyId) {
                    coinConfig = data.coinConfig[j]
                    break
                }
            }

            const info = Object.assign({}, data.spotConfig[i], coinConfig)
            
            result.push ({
                'id': data.spotConfig[i].symbol,
                'symbol': symbol,
                'base': base,
                'baseId': base,
                'quote': quote,
                'quoteId': quote,
                'info': info,
                'active': active,
                'taker' : coinConfig.takerFeeRate,
                'maker' : coinConfig.makerFeeRate,
                'percentage' : true,
                'tierBased': false,
                'precision': {
                    'amount': undefined,
                    'price': undefined,
                },
                'limits': {
                    'amount': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'price': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'cost': {
                        'min': undefined,
                        'max': undefined,
                    },
                },
            });
        }
        return result;
    }

    async fetchBalance (params = {}) {
        await this.loadMarkets (); 
        const timestamp = await this.getServerTime();
        
        const request = {
            'assetType' : 'spot',
            'timestamp' : timestamp
        };
        const response = await this.privatePostSpotAssetList (this.extend (request, params));
        const result = { 'info': response };
        const balances = this.safeValue (response, 'data');

        for (let i = 0; i < balances.length; i++) {
            const code = balances[i].coinType;
            const account = this.account();
            account['free'] = parseFloat (balances[i].count);
            account['used'] = parseFloat (balances[i].frozen);
            account['total'] = account['free'] + account['used'];
            result[code] = account;
        }
        return this.parseBalance (result);
    }

    async getServerTime () {
        const response = await this.publicGetServerTime();
        return response.timestamp;
    }

    async fetchOrderBook (symbol, limit = undefined, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = {
            'symbol': market['id'],
        };
        const response = await this.publicGetSpotOrderBook (this.extend (request, params));
        const data = this.safeValue (response, 'data', {});
        const timestamp = undefined;
        return this.parseOrderBook (data, timestamp, 'b', 's', 0, 1);
    }


    parseTicker (ticker, market = undefined, timestamp, orderbook) {
        // fetchTicker, fetchTickers
        //
        // ticker:
        //     {
        //          p: '-0.0146',
        //          ver: '17837553',
        //          vol: '8955372.73618900',
        //          c: '10225.34',
        //          s: 'BTC-USDT',
        //          t: '8955372.73618900',
        //          v: '863.738238',
        //          h: '10625.18',
        //          l: '9914.28',
        //          lev: '10'
        //      }
        // 
        //

        // orderbook:
        // {
        //     bids: [
        //       [ 10120.23, 0.125577 ], [ 10120.03, 0.092676 ], [ 10119.83, 0.110889 ],
        //       [ 10119.62, 0.101099 ], [ 10119.42, 0.07027 ],  [ 10119.22, 0.215033 ],
        //     ],
        //     asks: [
        //       [ 10121.26, 0.119571 ], [ 10121.46, 0.134903 ], [ 10121.66, 0.128835 ],
        //       [ 10121.87, 0.07317 ],  [ 10122.07, 0.117987 ], [ 10122.27, 0.159304 ],
        //     ],
        //     timestamp: undefined,
        //     datetime: undefined,
        //     nonce: undefined
        //   }
        //

        // WE NEED MORE DATA TO COMPLETE THE UNIFIED TICKER STRUCTURE

        // console.log(ticker, market, orderbook);
        
        // const open = this.safeFloat (ticker, 'c');
        // const close = this.safeFloat (ticker, 'c');
        const bid = this.safeFloat (orderbook.bids[0], 0);
        const ask = this.safeFloat (orderbook.asks[0], 0);

        let average = this.sum (bid, ask) / 2;
        const open = average;
        const close = average;
        // let change = undefined;
        // let percentage = undefined;
        // let average = undefined;
        // if ((close !== undefined) && (open !== undefined)) {
        //     change = close - open;
        //     if (open > 0) {
        //         percentage = change / open * 100;
        //     }
        //     average = this.sum (open, close) / 2;
        // }
        const baseVolume = this.safeFloat (ticker, 'v');
        const quoteVolume = this.safeFloat (ticker, 't');
        let vwap = undefined;
        if (quoteVolume !== undefined && baseVolume !== undefined) {
            vwap = quoteVolume / baseVolume;
        }
        return {
            'symbol': market['symbol'],
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'high': this.safeFloat (ticker, 'h'),
            'low': this.safeFloat (ticker, 'l'),
            'bid': bid,
            'bidVolume': this.safeFloat (orderbook.bids[0], 1),
            'ask': ask,
            'askVolume': this.safeFloat (orderbook.asks[0], 1),
            'vwap': vwap,
            'open': open,
            'close': close,
            'last': close,
            'previousClose': undefined,
            'change': undefined,
            'percentage': undefined,
            'average': average,
            'baseVolume': baseVolume,
            'quoteVolume': quoteVolume,
            'info': ticker,
        };
    }

    // async fetchTickers (symbols = undefined, params = {}) {
    //     await this.loadMarkets ();
    //     const response = await this.publicGetTickerAll (params);
    //     //
    //     //     {
    //     //         "status":"0000",
    //     //         "data":{
    //     //             "BTC":{
    //     //                 "opening_price":"9045000",
    //     //                 "closing_price":"9132000",
    //     //                 "min_price":"8938000",
    //     //                 "max_price":"9168000",
    //     //                 "units_traded":"4619.79967497",
    //     //                 "acc_trade_value":"42021363832.5187",
    //     //                 "prev_closing_price":"9041000",
    //     //                 "units_traded_24H":"8793.5045804",
    //     //                 "acc_trade_value_24H":"78933458515.4962",
    //     //                 "fluctate_24H":"530000",
    //     //                 "fluctate_rate_24H":"6.16"
    //     //             },
    //     //             "date":"1587710878669"
    //     //         }
    //     //     }
    //     //
    //     const result = {};
    //     const data = this.safeValue (response, 'data', {});
    //     const timestamp = this.safeInteger (data, 'date');
    //     const tickers = this.omit (data, 'date');
    //     const ids = Object.keys (tickers);
    //     for (let i = 0; i < ids.length; i++) {
    //         const id = ids[i];
    //         let symbol = id;
    //         let market = undefined;
    //         if (id in this.markets_by_id) {
    //             market = this.markets_by_id[id];
    //             symbol = market['symbol'];
    //         }
    //         const ticker = tickers[id];
    //         const isArray = Array.isArray (ticker);
    //         if (!isArray) {
    //             ticker['date'] = timestamp;
    //             result[symbol] = this.parseTicker (ticker, market);
    //         }
    //     }
    //     return result;
    // }

    async fetchTicker (symbol, params = {}) {
        await this.loadMarkets ();
        const orderbook = await this.fetchOrderBook(symbol);
        const market = this.market (symbol);
        const request = {
            'symbol': market['id'],
        };
        const response = await this.publicGetSpotTicker (this.extend (request, params));
        //
        // "data": [
        //     {
        //          p: '-0.0146',
        //          ver: '17837553',
        //          vol: '8955372.73618900',
        //          c: '10225.34',
        //          s: 'BTC-USDT',
        //          t: '8955372.73618900',
        //          v: '863.738238',
        //          h: '10625.18',
        //          l: '9914.28',
        //          lev: '10'
        //      }
        //     ],
        // "msg": "success",
        // "code": "0",
        // "timestamp": 1599307046338,
        // "startTime": null
        // }
        //
        const data = this.safeValue (response, 'data', {});
        return this.parseTicker (data[0], market, response.timestamp, orderbook);
    }

    // parseTrade (trade, market = undefined) {
    //     //
    //     // fetchTrades (public)
    //     //
    //     //     {
    //     //         "transaction_date":"2020-04-23 22:21:46",
    //     //         "type":"ask",
    //     //         "units_traded":"0.0125",
    //     //         "price":"8667000",
    //     //         "total":"108337"
    //     //     }
    //     //
    //     // fetchOrder (private)
    //     //
    //     //     {
    //     //         "transaction_date": "1572497603902030",
    //     //         "price": "8601000",
    //     //         "units": "0.005",
    //     //         "fee_currency": "KRW",
    //     //         "fee": "107.51",
    //     //         "total": "43005"
    //     //     }
    //     //
    //     // a workaround for their bug in date format, hours are not 0-padded
    //     let timestamp = undefined;
    //     const transactionDatetime = this.safeString (trade, 'transaction_date');
    //     if (transactionDatetime !== undefined) {
    //         const parts = transactionDatetime.split (' ');
    //         const numParts = parts.length;
    //         if (numParts > 1) {
    //             const transactionDate = parts[0];
    //             let transactionTime = parts[1];
    //             if (transactionTime.length < 8) {
    //                 transactionTime = '0' + transactionTime;
    //             }
    //             timestamp = this.parse8601 (transactionDate + ' ' + transactionTime);
    //         } else {
    //             timestamp = this.safeIntegerProduct (trade, 'transaction_date', 0.001);
    //         }
    //     }
    //     if (timestamp !== undefined) {
    //         timestamp -= 9 * 3600000; // they report UTC + 9 hours, server in Korean timezone
    //     }
    //     const type = undefined;
    //     let side = this.safeString (trade, 'type');
    //     side = (side === 'ask') ? 'sell' : 'buy';
    //     const id = this.safeString (trade, 'cont_no');
    //     let symbol = undefined;
    //     if (market !== undefined) {
    //         symbol = market['symbol'];
    //     }
    //     const price = this.safeFloat (trade, 'price');
    //     const amount = this.safeFloat (trade, 'units_traded');
    //     let cost = this.safeFloat (trade, 'total');
    //     if (cost === undefined) {
    //         if (amount !== undefined) {
    //             if (price !== undefined) {
    //                 cost = price * amount;
    //             }
    //         }
    //     }
    //     let fee = undefined;
    //     const feeCost = this.safeFloat (trade, 'fee');
    //     if (feeCost !== undefined) {
    //         const feeCurrencyId = this.safeString (trade, 'fee_currency');
    //         const feeCurrencyCode = this.commonCurrencyCode (feeCurrencyId);
    //         fee = {
    //             'cost': feeCost,
    //             'currency': feeCurrencyCode,
    //         };
    //     }
    //     return {
    //         'id': id,
    //         'info': trade,
    //         'timestamp': timestamp,
    //         'datetime': this.iso8601 (timestamp),
    //         'symbol': symbol,
    //         'order': undefined,
    //         'type': type,
    //         'side': side,
    //         'takerOrMaker': undefined,
    //         'price': price,
    //         'amount': amount,
    //         'cost': cost,
    //         'fee': fee,
    //     };
    // }

    // async fetchTrades (symbol, since = undefined, limit = undefined, params = {}) {
    //     await this.loadMarkets ();
    //     const market = this.market (symbol);
    //     const request = {
    //         'currency': market['base'],
    //     };
    //     if (limit === undefined) {
    //         request['count'] = limit; // default 20, max 100
    //     }
    //     const response = await this.publicGetTransactionHistoryCurrency (this.extend (request, params));
    //     //
    //     //     {
    //     //         "status":"0000",
    //     //         "data":[
    //     //             {
    //     //                 "transaction_date":"2020-04-23 22:21:46",
    //     //                 "type":"ask",
    //     //                 "units_traded":"0.0125",
    //     //                 "price":"8667000",
    //     //                 "total":"108337"
    //     //             },
    //     //         ]
    //     //     }
    //     //
    //     const data = this.safeValue (response, 'data', []);
    //     return this.parseTrades (data, market, since, limit);
    // }

    // async createOrder (symbol, type, side, amount, price = undefined, params = {}) {
    //     await this.loadMarkets ();
    //     const market = this.market (symbol);
    //     const request = {
    //         'order_currency': market['id'],
    //         'Payment_currency': market['quote'],
    //         'units': amount,
    //     };
    //     let method = 'privatePostTradePlace';
    //     if (type === 'limit') {
    //         request['price'] = price;
    //         request['type'] = (side === 'buy') ? 'bid' : 'ask';
    //     } else {
    //         method = 'privatePostTradeMarket' + this.capitalize (side);
    //     }
    //     const response = await this[method] (this.extend (request, params));
    //     const id = this.safeString (response, 'order_id');
    //     if (id === undefined) {
    //         throw new InvalidOrder (this.id + ' createOrder did not return an order id');
    //     }
    //     return {
    //         'info': response,
    //         'symbol': symbol,
    //         'type': type,
    //         'side': side,
    //         'id': id,
    //     };
    // }

    // async fetchOrder (id, symbol = undefined, params = {}) {
    //     if (symbol === undefined) {
    //         throw new ArgumentsRequired (this.id + ' fetchOrder requires a symbol argument');
    //     }
    //     await this.loadMarkets ();
    //     const market = this.market (symbol);
    //     const request = {
    //         'order_id': id,
    //         'count': 1,
    //         'order_currency': market['base'],
    //         'payment_currency': market['quote'],
    //     };
    //     const response = await this.privatePostInfoOrderDetail (this.extend (request, params));
    //     //
    //     //     {
    //     //         "status": "0000",
    //     //         "data": {
    //     //             "transaction_date": "1572497603668315",
    //     //             "type": "bid",
    //     //             "order_status": "Completed",
    //     //             "order_currency": "BTC",
    //     //             "payment_currency": "KRW",
    //     //             "order_price": "8601000",
    //     //             "order_qty": "0.007",
    //     //             "cancel_date": "",
    //     //             "cancel_type": "",
    //     //             "contract": [
    //     //                 {
    //     //                     "transaction_date": "1572497603902030",
    //     //                     "price": "8601000",
    //     //                     "units": "0.005",
    //     //                     "fee_currency": "KRW",
    //     //                     "fee": "107.51",
    //     //                     "total": "43005"
    //     //                 },
    //     //             ]
    //     //         }
    //     //     }
    //     //
    //     const data = this.safeValue (response, 'data');
    //     return this.parseOrder (this.extend (data, { 'order_id': id }), market);
    // }

    // parseOrderStatus (status) {
    //     const statuses = {
    //         'Pending': 'open',
    //         'Completed': 'closed',
    //         'Cancel': 'canceled',
    //     };
    //     return this.safeString (statuses, status, status);
    // }

    // parseOrder (order, market = undefined) {
    //     //
    //     // fetchOrder
    //     //
    //     //     {
    //     //         "transaction_date": "1572497603668315",
    //     //         "type": "bid",
    //     //         "order_status": "Completed",
    //     //         "order_currency": "BTC",
    //     //         "payment_currency": "KRW",
    //     //         "order_price": "8601000",
    //     //         "order_qty": "0.007",
    //     //         "cancel_date": "",
    //     //         "cancel_type": "",
    //     //         "contract": [
    //     //             {
    //     //                 "transaction_date": "1572497603902030",
    //     //                 "price": "8601000",
    //     //                 "units": "0.005",
    //     //                 "fee_currency": "KRW",
    //     //                 "fee": "107.51",
    //     //                 "total": "43005"
    //     //             },
    //     //         ]
    //     //     }
    //     //
    //     // fetchOpenOrders
    //     //
    //     //     {
    //     //         "order_currency": "BTC",
    //     //         "payment_currency": "KRW",
    //     //         "order_id": "C0101000007408440032",
    //     //         "order_date": "1571728739360570",
    //     //         "type": "bid",
    //     //         "units": "5.0",
    //     //         "units_remaining": "5.0",
    //     //         "price": "501000",
    //     //     }
    //     //
    //     const timestamp = this.safeIntegerProduct (order, 'order_date', 0.001);
    //     const sideProperty = this.safeValue2 (order, 'type', 'side');
    //     const side = (sideProperty === 'bid') ? 'buy' : 'sell';
    //     const status = this.parseOrderStatus (this.safeString (order, 'order_status'));
    //     let price = this.safeFloat2 (order, 'order_price', 'price');
    //     let type = 'limit';
    //     if (price === 0) {
    //         price = undefined;
    //         type = 'market';
    //     }
    //     const amount = this.safeFloat2 (order, 'order_qty', 'units');
    //     let remaining = this.safeFloat (order, 'units_remaining');
    //     if (remaining === undefined) {
    //         if (status === 'closed') {
    //             remaining = 0;
    //         } else {
    //             remaining = amount;
    //         }
    //     }
    //     let filled = undefined;
    //     if ((amount !== undefined) && (remaining !== undefined)) {
    //         filled = amount - remaining;
    //     }
    //     let symbol = undefined;
    //     const baseId = this.safeString (order, 'order_currency');
    //     const quoteId = this.safeString (order, 'payment_currency');
    //     const base = this.safeCurrencyCode (baseId);
    //     const quote = this.safeCurrencyCode (quoteId);
    //     if ((base !== undefined) && (quote !== undefined)) {
    //         symbol = base + '/' + quote;
    //     }
    //     if ((symbol === undefined) && (market !== undefined)) {
    //         symbol = market['symbol'];
    //     }
    //     const rawTrades = this.safeValue (order, 'contract');
    //     let trades = undefined;
    //     const id = this.safeString (order, 'order_id');
    //     if (rawTrades !== undefined) {
    //         trades = this.parseTrades (rawTrades, market, undefined, undefined, {
    //             'side': side,
    //             'symbol': symbol,
    //             'order': id,
    //         });
    //     }
    //     return {
    //         'info': order,
    //         'id': id,
    //         'timestamp': timestamp,
    //         'datetime': this.iso8601 (timestamp),
    //         'lastTradeTimestamp': undefined,
    //         'symbol': symbol,
    //         'type': type,
    //         'side': side,
    //         'price': price,
    //         'amount': amount,
    //         'cost': undefined,
    //         'average': undefined,
    //         'filled': filled,
    //         'remaining': remaining,
    //         'status': status,
    //         'fee': undefined,
    //         'trades': trades,
    //     };
    // }

    // async fetchOpenOrders (symbol = undefined, since = undefined, limit = undefined, params = {}) {
    //     if (symbol === undefined) {
    //         throw new ArgumentsRequired (this.id + ' fetchOpenOrders requires a symbol argument');
    //     }
    //     await this.loadMarkets ();
    //     const market = this.market (symbol);
    //     if (limit === undefined) {
    //         limit = 100;
    //     }
    //     const request = {
    //         'count': limit,
    //         'order_currency': market['base'],
    //         'payment_currency': market['quote'],
    //     };
    //     if (since !== undefined) {
    //         request['after'] = since;
    //     }
    //     const response = await this.privatePostInfoOrders (this.extend (request, params));
    //     //
    //     //     {
    //     //         "status": "0000",
    //     //         "data": [
    //     //             {
    //     //                 "order_currency": "BTC",
    //     //                 "payment_currency": "KRW",
    //     //                 "order_id": "C0101000007408440032",
    //     //                 "order_date": "1571728739360570",
    //     //                 "type": "bid",
    //     //                 "units": "5.0",
    //     //                 "units_remaining": "5.0",
    //     //                 "price": "501000",
    //     //             }
    //     //         ]
    //     //     }
    //     //
    //     const data = this.safeValue (response, 'data', []);
    //     return this.parseOrders (data, market, since, limit);
    // }

    // async cancelOrder (id, symbol = undefined, params = {}) {
    //     const side_in_params = ('side' in params);
    //     if (!side_in_params) {
    //         throw new ArgumentsRequired (this.id + ' cancelOrder requires a `symbol` argument and a `side` parameter (sell or buy)');
    //     }
    //     if (symbol === undefined) {
    //         throw new ArgumentsRequired (this.id + ' cancelOrder requires a `symbol` argument and a `side` parameter (sell or buy)');
    //     }
    //     const market = this.market (symbol);
    //     const side = (params['side'] === 'buy') ? 'bid' : 'ask';
    //     params = this.omit (params, [ 'side', 'currency' ]);
    //     // https://github.com/ccxt/ccxt/issues/6771
    //     const request = {
    //         'order_id': id,
    //         'type': side,
    //         'order_currency': market['base'],
    //         'payment_currency': market['quote'],
    //     };
    //     return await this.privatePostTradeCancel (this.extend (request, params));
    // }

    // cancelUnifiedOrder (order, params = {}) {
    //     const request = {
    //         'side': order['side'],
    //     };
    //     return this.cancelOrder (order['id'], order['symbol'], this.extend (request, params));
    // }

    // async withdraw (code, amount, address, tag = undefined, params = {}) {
    //     this.checkAddress (address);
    //     await this.loadMarkets ();
    //     const currency = this.currency (code);
    //     const request = {
    //         'units': amount,
    //         'address': address,
    //         'currency': currency['id'],
    //     };
    //     if (currency === 'XRP' || currency === 'XMR') {
    //         const destination = this.safeString (params, 'destination');
    //         if ((tag === undefined) && (destination === undefined)) {
    //             throw new ArgumentsRequired (this.id + ' ' + code + ' withdraw() requires a tag argument or an extra destination param');
    //         } else if (tag !== undefined) {
    //             request['destination'] = tag;
    //         }
    //     }
    //     const response = await this.privatePostTradeBtcWithdrawal (this.extend (request, params));
    //     return {
    //         'info': response,
    //         'id': undefined,
    //     };
    // }

    nonce () {
        return this.milliseconds ();
    }

    sign (path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        const endpoint = '/' + this.implodeParams (path, params);
        let url = this.urls['api'][api] + endpoint;
        const query = this.omit (params, this.extractParams (path));
        if (api === 'public') {
            if (Object.keys (query).length) {
                url += '?' + this.urlencode (query);
            }
        } else {
            // private endpoint - authentication required
            method = 'POST';
            this.checkRequiredCredentials ();
            let query2 = this.extend({
                'apiKey' : this.apiKey,
            }, query)

            // key sort:
            let query3 = {};
            Object.keys(query2).sort().forEach(function(key) { 
                query3[key] = query2[key];
            });

            const auth = this.urlencode (query3);
            const signature = this.hmac (this.encode (auth), this.encode (this.secret), 'sha256');
            body = JSON.stringify(this.extend(body, query3, {'signature' : signature}))
            headers = {
                'content-type': 'application/json',
            };
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    handleErrors (httpCode, reason, url, method, headers, body, response, requestHeaders, requestBody) {
        if (response === undefined) {
            return; // fallback to default error handler
        }
        if ('status' in response) {
            //
            //     {"status":"5100","message":"After May 23th, recent_transactions is no longer, hence users will not be able to connect to recent_transactions"}
            //
            const status = this.safeString (response, 'status');
            const message = this.safeString (response, 'message');
            if (status !== undefined) {
                if (status === '0000') {
                    return; // no error
                }
                const feedback = this.id + ' ' + body;
                this.throwExactlyMatchedException (this.exceptions, status, feedback);
                this.throwExactlyMatchedException (this.exceptions, message, feedback);
                throw new ExchangeError (feedback);
            }
        }
    }

    async request (path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        const response = await this.fetch2 (path, api, method, params, headers, body);
        if ('status' in response) {
            if (response['status'] === '0000') {
                return response;
            }
            throw new ExchangeError (this.id + ' ' + this.json (response));
        }
        return response;
    }
};