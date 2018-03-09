const axios = require('axios')
const _ = require('lodash')

const baseURL = process.env.BASE_URL || 'http://localhost:3333'
const GATEWAY_OPERATOR_PRIVATE_KEY =
  'ca1398820695e93cea849b841a9aae4eeae65518d14353ab73d21fa4af2d58a7'
const GATEWAY_OPERATOR_ADDRESS = '0x3df2fd51cf19c0d8d1861d6ebc6457a1b0c7496f'

const metadata = {
  data: {
    name: 'Temperature outside Bar Berlin',
    geo: {
      lat: 50.880722,
      lng: 4.692725,
    },
    type: 'temperature',
    example: "{'value':11,'unit':'celsius'}",
    updateinterval: 60000,
  },
}

contract('Integration test: enlisting a stream', function(accounts) {
  let token

  beforeEach(async () => {
    const response = await axios.post(`${baseURL}/authenticate`, {
      privateKeys: {
        ethereum: GATEWAY_OPERATOR_PRIVATE_KEY,
      },
      encrypted: false,
    })
    token = response.data.token
  })

  it('should be able to authenticate using an authorised address', async () => {
    const response = await axios.post(`${baseURL}/authenticate`, {
      privateKeys: {
        ethereum: GATEWAY_OPERATOR_PRIVATE_KEY,
      },
      encrypted: false,
    })
    assert.isOk(response.data.token)
  })

  it('should not be possible to authenticate using an authorised address', async () => {
    try {
      await axios.post(`${baseURL}/authenticate`, {
        privateKeys: {
          ethereum: GATEWAY_OPERATOR_PRIVATE_KEY,
        },
        encrypted: false,
      })
    } catch (e) {
      assert.equal(e.response.status, 402)
    }
  })

  it('should enlist a stream when all parameters are correct', async () => {
    // Get token address
    const tokenListRes = await axios({
      method: 'get',
      url: `${baseURL}/dtxtokenregistry/list`,
      headers: {
        Authorization: token,
      },
    })
    assert.equal(tokenListRes.status, 200)
    const tokenAddress = _.get(tokenListRes, 'data.items[0].contractaddress')

    // Get streamregistry address
    const registryListRes = await axios({
      method: 'get',
      url: `${baseURL}/streamregistry/list`,
      headers: {
        Authorization: token,
      },
    })
    assert.equal(registryListRes.status, 200)
    const registryAddress = _.get(registryListRes, 'data.base.key')

    // // Create IPFS
    // try {
    //   const ipfsRes = await axios({
    //     method: 'post',
    //     url: `${baseURL}/ipfs/add/json`,
    //     data: JSON.stringify(metadata),
    //     headers: {
    //       Authorization: token,
    //     },
    //   })
    // } catch (e) {
    //   console.log(e)
    // }

    // const ipfsHash = _.get(ipfsRes, 'data[0].hash')
    // console.log('--', ipfsHash)

    // Approve first
    await axios({
      method: 'post',
      url: `${baseURL}/dtxtoken/${tokenAddress}/approve`,
      data: {
        spender: registryAddress,
        value: '10',
      },
      headers: {
        Authorization: token,
      },
    })

    // Finally, enlist
    await axios({
      method: 'post',
      url: `${baseURL}/streamregistry/enlist`,
      data: {
        price: '10',
        stakeamount: '10',
        metadata: 'bla',
      },
      headers: {
        Authorization: token,
      },
    })
  })
})
