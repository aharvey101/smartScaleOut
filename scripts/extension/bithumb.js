const axios = require('axios')
const https = require('https')
const crypto = require('crypto')
const querystring = require('querystring')

class Bithumb {
  constructor(key, secret) {
    this.apiKey = key
    this.secret = secret
    this.API_URL = 'http://global-openapi.bithumb.pro/openapi/v1'
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
    return this._public('/serverTime')
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
    const serverTime = await getServerTime(this.API_URL)
    .then(response => (response))
    // then createSignatureString
    const signatureString = await createSignatureString(this.apiKey, serverTime, this.API_URL, endpoint)
    
    async function createSignatureString(apiKey, serverTime, apiURL, endpoint) {
      //string json = apikey&msgNo&timestamp&version
      const now = serverTime
      console.log('now is ', now);
      // const ss = apiKey + 123456789 + now
      const ss = `${apiURL}${endpoint}?apiKey=${apiKey}&assetType=spot&msgNo=${now}&timestamp=${now}`
      console.log(ss)
      return ss
    }
    const apiSignature = Buffer.from(crypto.createHmac('sha256', this.secret).update(signatureString).digest('hex')).toString('base64')
    
    async function getServerTime(apiUrl) {
      const timestamp = await axios({
        method: 'GET',
        url: apiUrl + '/serverTime'
      })
      .then(response => (response))
      .catch(error => console.log(error))
      console.log('timestamp is', timestamp.data.timestamp);
      return timestamp.data.timestamp
    }
    // then create options from all parameters
    const options = {
      method: 'POST',
      url: this.API_URL + endpoint,
      params: {
        apiKey: this.apiKey,
        assetType:'spot',
        msgNo: serverTime,
        timestamp: serverTime,
        signature: apiSignature
      },
      headers: {
        'content-type': 'application/json'
      },
    }

    const response = await axios(options)
      .then(response => (response))
      .catch(error => console.log(error))

    return response
  }

  async marketSell(symbol, type, side, price, quantity) {
    return this._private('/trade/placeOrder', { symbol, type, side, price, quantity })
  }

  async getAccount() {
    return this._private('/spot/assetList')
  }

  async getTimestamp(){
    return this._getTimestamp()
  }

}

module.exports = Bithumb
