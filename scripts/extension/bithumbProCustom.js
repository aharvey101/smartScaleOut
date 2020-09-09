const axios = require('axios')
const https = require('https')
// const crypto = require('crypto')
const sha256 = require('js-sha256').sha256
const querystring = require('querystring')
// const cryptojs = require('crypto-js')

class Bithumb {
  constructor(key, secret) {
    this.apiKey = key
    this.secret = secret
    this.API_URL = 'https://global-openapi.bithumb.pro/openapi/v1'
    this.version = 'V1.0.0'
  }
  // ----------------------------------------------------------------
  // PUBLIC

  async _public(endpoint, parameters) {
    // const hmacSignature = Buffer.from(crypto.createHmac('sha512', this.secret).update(requestSignature).digest('hex')).toString('base64')

    const options = {
      method: 'POST',
      url: this.API_URL + endpoint,
      params: parameters,
      auth: {
        'apiKey': this.apiKey,
        // 'timestamp': _nonce,
        // 'signature': hmacSignature,
        // 'msgNo': _nonce
      }
    }
    const response = await axios(options)
      .then(response => (response.data))
    return response
  }

  async getTicker(currency) {
    return this._public('/spot/ticker', currency)
  }

  async getOrderbook(currency) {
    return this._public('/spot/orderBook', currency)
  }

  async getServerTime() {
    const response = await this._public('/serverTime')
    return response.timestamp
  }
  // async getRecentTransactions (currency) {
  //   return this._public('/public/recent_transactions', currency)
  // }

  // ----------------------------------------------------------------
  // PRIVATE AUTHENTICATION
  async _private(endpoint, parameters) {
    if (!parameters) {
      parameters = {}
    }

    let toDelete = []
    for (let key in parameters) {
      if (!parameters[key]) {
        toDelete.push(key)
      }
    }
    for (let i = 0; i < toDelete.length; i++) {
      delete parameters[toDelete[i]]
    }

    parameters.endPoint = endpoint

    // get Servertime
    const serverTime = await this.getServerTime()
    // .then(response => (response))
    // console.log('serverTime = ', serverTime)
    // then createSignatureString
    const signatureString = await createSignatureString(this.apiKey, serverTime, 'spot', parameters.asset)
    
    async function createSignatureString(apiKey, serverTime, assetType, coinType) {
      // REFACTOR THIS CODE TO ACCEPT REQUEST PARAMETERS, KEY-SORT THEM, CONVERT TO key1=value1&key2=value2 STRING
      //string json = apikey&msgNo&timestamp&version
      const now = serverTime
      const ss = `apiKey=${apiKey}&assetType=${assetType}&coinType=${coinType}&msgNo=msgNo&timestamp=${now}`
      // console.log('SignatureString = ', ss)
      return ss
    }
    // const apiSignature = crypto.createHmac('sha256', this.secret).update(signatureString).digest('hex')
    const apiSignature = sha256.hmac(this.secret, signatureString)
    // console.log('apiSignature', apiSignature)
    
    // then create options from all parameters
    const options = {
      method: 'POST',
      url: this.API_URL + endpoint,
      data: {
        'apiKey': this.apiKey,
        'assetType':'spot',
        'coinType' : parameters.asset,
        'msgNo': 'msgNo',
        'timestamp': serverTime,
        'signature': apiSignature,
        'symbol': parameters.pair,
        // 'type': parameters.type, 
        // 'side': parameters.side, 
        // 'price': parameters.price, 
        // 'amount': parameters.amount, 
      },
      headers: {
        'content-type': 'application/json'
      },
    }
    console.log('options =', options)

    const response = await axios(options)
      .then(response => (response.data))
      .catch(error => console.log(error))
    // console.log('response =', response)

    return response
  }

  async marketSell(params) {
    return this._private('/trade/placeOrder', params)
  }

  async getAccount(params) {
    return this._private('/spot/assetList', params)
  }

  // async getServerTime(){
  //   return this._private('/serverTime')
  // }

}

module.exports = Bithumb