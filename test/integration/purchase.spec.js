const axios = require('axios')
const _ = require('lodash')

const baseURL = process.env.BASE_URL || 'http://localhost:3333'
const GATEWAY_OPERATOR_PRIVATE_KEY =
  'ca1398820695e93cea849b841a9aae4eeae65518d14353ab73d21fa4af2d58a7'
const GATEWAY_OPERATOR_ADDRESS = '0x3df2fd51cf19c0d8d1861d6ebc6457a1b0c7496f'

const metadata = {
  data: {
    storageCredentials: {
      type: 'DROPBOX',
      username: 'silke@test.be',
      password: '1313p21323012312032163120313', // This should be a hash of the password entered by the user
    },
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

  it('should purchase a stream when all parameters are correct', async () => {
    // Get stream address
    const streamListRes = await axios({
      method: 'get',
      url: `${baseURL}/streamregistry/list`,
      headers: {
        Authorization: token,
      },
    })
    assert.equal(streamListRes.status, 200)
    const streamAddress = _.get(streamListRes, 'data.items[0].contractaddress') // We just take the first stream

    // Calculate endtime
    const endtime = new Date().getTime() / 1000 + 60 // one minute from now

    // Create IPFS
    const ipfsRes = await axios({
      method: 'post',
      url: `${baseURL}/ipfs/add/json`,
      data: metadata,
      headers: {
        Authorization: token,
      },
    })
    assert.equal(ipfsRes.status, 200)
    const ipfsHash = _.get(ipfsRes, 'data[0].hash')

    // Purchase
    const purchaseRes = await axios({
      method: 'post',
      url: `${baseURL}/purchaseregistry/purchaseaccess`,
      data: {
        stream: streamAddress,
        endtime: endtime.toString(),
        metadata: ipfsHash,
      },
      headers: {
        Authorization: token,
      },
    })
    assert.equal(purchaseRes.status, 200)
  })
})
