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

contract('Integration tests', function(accounts) {
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

  // it('should be able to authenticate using an authorised address', async () => {
  //   const response = await axios.post(`${baseURL}/authenticate`, {
  //     privateKeys: {
  //       ethereum: GATEWAY_OPERATOR_PRIVATE_KEY,
  //     },
  //     encrypted: false,
  //   })
  //   assert.isOk(response.data.token)
  // })

  // it('should not be possible to authenticate using an authorised address', async () => {
  //   try {
  //     await axios.post(`${baseURL}/authenticate`, {
  //       privateKeys: {
  //         ethereum: GATEWAY_OPERATOR_PRIVATE_KEY,
  //       },
  //       encrypted: false,
  //     })
  //   } catch (e) {
  //     assert.equal(e.response.status, 402)
  //   }
  // })

  // it('should enlist a stream when all parameters are correct', async () => {
  //   // Get token address
  //   const tokenListRes = await axios({
  //     method: 'get',
  //     url: `${baseURL}/dtxtokenregistry/list`,
  //     headers: {
  //       Authorization: token,
  //     },
  //   })
  //   assert.equal(tokenListRes.status, 200)
  //   const tokenAddress = _.get(tokenListRes, 'data.items[0].contractaddress')

  //   // Get streamregistry address
  //   const registryListRes = await axios({
  //     method: 'get',
  //     url: `${baseURL}/streamregistry/list`,
  //     headers: {
  //       Authorization: token,
  //     },
  //   })
  //   assert.equal(registryListRes.status, 200)
  //   const registryAddress = _.get(registryListRes, 'data.base.key')

  //   // Create IPFS
  //   const ipfsRes = await axios({
  //     method: 'post',
  //     url: `${baseURL}/ipfs/add/json`,
  //     data: metadata,
  //     headers: {
  //       Authorization: token,
  //     },
  //   })
  //   assert.equal(ipfsRes.status, 200)
  //   const ipfsHash = _.get(ipfsRes, 'data[0].hash')

  //   // Approve first
  //   const approveRes = await axios({
  //     method: 'post',
  //     url: `${baseURL}/dtxtoken/${tokenAddress}/approve`,
  //     data: {
  //       spender: registryAddress,
  //       value: '10',
  //     },
  //     headers: {
  //       Authorization: token,
  //     },
  //   })
  //   assert.equal(approveRes.status, 200)

  //   // Finally, enlist
  //   const enlistRes = await axios({
  //     method: 'post',
  //     url: `${baseURL}/streamregistry/enlist`,
  //     data: {
  //       price: '10',
  //       stakeamount: '10',
  //       metadata: ipfsHash,
  //     },
  //     headers: {
  //       Authorization: token,
  //     },
  //   })
  //   assert.equal(enlistRes.status, 200)
  // })

  // it('should mint DTX for the msg.sender', async () => {
  //   // Create new user
  //   const walletRes = await axios({
  //     method: 'post',
  //     url: `${baseURL}/wallet`,
  //     data: {
  //       email: 'silke@databrokerdao.com',
  //       password: 'dbdao',
  //     },
  //   })
  //   const newPrivateKey = _.get(walletRes, 'data.privateKey')

  //   // Authenticate
  //   const authRes = await axios({
  //     method: 'post',
  //     url: `${baseURL}/authenticate`,
  //     data: {
  //       privateKeys: {
  //         ethereum: newPrivateKey,
  //       },
  //       encrypted: false,
  //     },
  //   })
  //   const newToken = _.get(authRes, 'data.token')

  //   const mintRes = await axios({
  //     method: 'post',
  //     url: `${baseURL}/dtxminter/mint`,
  //     data: {
  //       amount: '1000',
  //     },
  //     headers: {
  //       Authorization: newToken,
  //     },
  //   })

  //   assert.equal(mintRes.status, 200)
  //   assert.equal(
  //     _.get(mintRes, 'data.debug.sender.balances.DTX.balance'),
  //     '1000'
  //   )
  // })

  // it('should purchase a stream when all parameters are correct', async () => {
  //   // Get token address
  //   const tokenListRes = await axios({
  //     method: 'get',
  //     url: `${baseURL}/dtxtokenregistry/list`,
  //     headers: {
  //       Authorization: token,
  //     },
  //   })
  //   assert.equal(tokenListRes.status, 200)
  //   const tokenAddress = _.get(tokenListRes, 'data.items[0].contractaddress')

  //   // Get streamregistry address
  //   const registryListRes = await axios({
  //     method: 'get',
  //     url: `${baseURL}/streamregistry/list`,
  //     headers: {
  //       Authorization: token,
  //     },
  //   })
  //   assert.equal(registryListRes.status, 200)
  //   const streamRegistryAddress = _.get(registryListRes, 'data.base.key')

  //   // Create IPFS
  //   const ipfsRes = await axios({
  //     method: 'post',
  //     url: `${baseURL}/ipfs/add/json`,
  //     data: metadata,
  //     headers: {
  //       Authorization: token,
  //     },
  //   })
  //   assert.equal(ipfsRes.status, 200)
  //   const ipfsHash = _.get(ipfsRes, 'data[0].hash')

  //   // Approve first
  //   const approveRes = await axios({
  //     method: 'post',
  //     url: `${baseURL}/dtxtoken/${tokenAddress}/approve`,
  //     data: {
  //       spender: streamRegistryAddress,
  //       value: '10',
  //     },
  //     headers: {
  //       Authorization: token,
  //     },
  //   })
  //   assert.equal(approveRes.status, 200)

  //   // Finally, enlist
  //   const enlistRes = await axios({
  //     method: 'post',
  //     url: `${baseURL}/streamregistry/enlist`,
  //     data: {
  //       price: '10',
  //       stakeamount: '10',
  //       metadata: ipfsHash,
  //     },
  //     headers: {
  //       Authorization: token,
  //     },
  //   })
  //   assert.equal(enlistRes.status, 200)

  //   const event = _.filter(
  //     enlistRes.data.events,
  //     log => log.event === 'Enlisted'
  //   )[0]
  //   const streamAddress = event.listing

  //   // Calculate endtime
  //   const endtime = new Date().getTime() / 1000 + 60 // one minute from now

  //   // Create IPFS
  //   const purchaseIpfsRes = await axios({
  //     method: 'post',
  //     url: `${baseURL}/ipfs/add/json`,
  //     data: metadata,
  //     headers: {
  //       Authorization: token,
  //     },
  //   })
  //   assert.equal(purchaseIpfsRes.status, 200)
  //   const purchaseIpfsHash = _.get(purchaseIpfsRes, 'data[0].hash')

  //   // Get purchaseregistry address
  //   const purchaseRegistryListRes = await axios({
  //     method: 'get',
  //     url: `${baseURL}/purchaseregistry/list`,
  //     headers: {
  //       Authorization: token,
  //     },
  //   })
  //   assert.equal(purchaseRegistryListRes.status, 200)
  //   const purchaseRegistryAddress = _.get(
  //     purchaseRegistryListRes,
  //     'data.base.key'
  //   )

  //   // Approve first
  //   const approvePurchaseRes = await axios({
  //     method: 'post',
  //     url: `${baseURL}/dtxtoken/${tokenAddress}/approve`,
  //     data: {
  //       spender: purchaseRegistryAddress,
  //       value: '1000',
  //     },
  //     headers: {
  //       Authorization: token,
  //     },
  //   })
  //   assert.equal(approvePurchaseRes.status, 200)

  //   // Purchase
  //   const purchaseRes = await axios({
  //     method: 'post',
  //     url: `${baseURL}/purchaseregistry/purchaseaccess`,
  //     data: {
  //       stream: streamAddress,
  //       endtime: endtime.toString(),
  //       metadata: purchaseIpfsHash,
  //     },
  //     headers: {
  //       Authorization: token,
  //     },
  //   })
  //   assert.equal(purchaseRes.status, 200)
  // })

  // it('should go through the whole process: enlist, new user, mint tokens, purchase', async () => {
  //   // Get token address: needed for approve calls
  //   const tokenListRes = await axios({
  //     method: 'get',
  //     url: `${baseURL}/dtxtokenregistry/list`,
  //     headers: {
  //       Authorization: token,
  //     },
  //   })
  //   assert.equal(tokenListRes.status, 200)
  //   const tokenAddress = _.get(tokenListRes, 'data.items[0].contractaddress')

  //   // Get streamregistry address: needed for approve calls
  //   const registryListRes = await axios({
  //     method: 'get',
  //     url: `${baseURL}/streamregistry/list`,
  //     headers: {
  //       Authorization: token,
  //     },
  //   })
  //   assert.equal(registryListRes.status, 200)
  //   const streamRegistryAddress = _.get(registryListRes, 'data.base.key')

  //   // Create IPFS for stream enlisting
  //   const streamIpfsRes = await axios({
  //     method: 'post',
  //     url: `${baseURL}/ipfs/add/json`,
  //     data: metadata,
  //     headers: {
  //       Authorization: token,
  //     },
  //   })
  //   assert.equal(streamIpfsRes.status, 200)
  //   const streamIpfsHash = _.get(streamIpfsRes, 'data[0].hash')

  //   // Approve the stake amount first, before enlisting
  //   const approveRes = await axios({
  //     method: 'post',
  //     url: `${baseURL}/dtxtoken/${tokenAddress}/approve`,
  //     data: {
  //       spender: streamRegistryAddress,
  //       value: '10',
  //     },
  //     headers: {
  //       Authorization: token,
  //     },
  //   })
  //   assert.equal(approveRes.status, 200)

  //   // Enlist
  //   const enlistRes = await axios({
  //     method: 'post',
  //     url: `${baseURL}/streamregistry/enlist`,
  //     data: {
  //       price: '1',
  //       stakeamount: '10',
  //       metadata: streamIpfsHash,
  //     },
  //     headers: {
  //       Authorization: token,
  //     },
  //   })
  //   assert.equal(enlistRes.status, 200)

  //   // Create new user
  //   const walletRes = await axios({
  //     method: 'post',
  //     url: `${baseURL}/wallet`,
  //     data: {
  //       email: 'silke@databrokerdao.com',
  //       password: 'dbdao',
  //     },
  //   })
  //   const newPrivateKey = _.get(walletRes, 'data.privateKey')

  //   // Authenticate with this user
  //   const authRes = await axios({
  //     method: 'post',
  //     url: `${baseURL}/authenticate`,
  //     data: {
  //       privateKeys: {
  //         ethereum: newPrivateKey,
  //       },
  //       encrypted: false,
  //     },
  //   })
  //   const newToken = _.get(authRes, 'data.token')

  //   // Mint 1000 DTX for the new user
  //   const mintRes = await axios({
  //     method: 'post',
  //     url: `${baseURL}/dtxminter/mint`,
  //     data: {
  //       amount: (1000 * Math.pow(10, 18)).toString(), // 1000 DTX, taking the 18 decimals into account
  //     },
  //     headers: {
  //       Authorization: newToken,
  //     },
  //   })

  //   assert.equal(mintRes.status, 200)

  //   // Save stream address for purchase
  //   const event = _.filter(
  //     enlistRes.data.events,
  //     log => log.event === 'Enlisted'
  //   )[0]
  //   const streamAddress = event.listing

  //   // Calculate endtime
  //   const endtime = new Date().getTime() / 1000 + 60 * 60 * 24 * 7 // one week from now

  //   // Create purchase IPFS
  //   const purchaseIpfsRes = await axios({
  //     method: 'post',
  //     url: `${baseURL}/ipfs/add/json`,
  //     data: metadata,
  //     headers: {
  //       Authorization: newToken,
  //     },
  //   })
  //   assert.equal(purchaseIpfsRes.status, 200)
  //   const purchaseIpfsHash = _.get(purchaseIpfsRes, 'data[0].hash')

  //   // Get purchaseregistry address: for approving
  //   const purchaseRegistryListRes = await axios({
  //     method: 'get',
  //     url: `${baseURL}/purchaseregistry/list`,
  //     headers: {
  //       Authorization: newToken,
  //     },
  //   })
  //   assert.equal(purchaseRegistryListRes.status, 200)
  //   const purchaseRegistryAddress = _.get(
  //     purchaseRegistryListRes,
  //     'data.base.key'
  //   )

  //   // Approve the amount we guess the sensor will cost
  //   const amount = 1 * endtime - new Date().getTime() / 1000 + 1000 // stream price times the endtime minus the start time, 1000 seconds added to be safe
  //   const approvePurchaseRes = await axios({
  //     method: 'post',
  //     url: `${baseURL}/dtxtoken/${tokenAddress}/approve`,
  //     data: {
  //       spender: purchaseRegistryAddress,
  //       value: amount.toString(),
  //     },
  //     headers: {
  //       Authorization: newToken,
  //     },
  //   })
  //   assert.equal(approvePurchaseRes.status, 200)

  //   // Purchase
  //   const purchaseRes = await axios({
  //     method: 'post',
  //     url: `${baseURL}/purchaseregistry/purchaseaccess`,
  //     data: {
  //       stream: streamAddress,
  //       endtime: endtime.toString(),
  //       metadata: purchaseIpfsHash,
  //     },
  //     headers: {
  //       Authorization: newToken,
  //     },
  //   })
  //   assert.equal(purchaseRes.status, 200)
  // })

  // it('should give DTX to data owner when challenge is approved', async () => {
  //   /*
  //   * ENLIST
  //   */

  //   // Get token address: needed for approve calls
  //   const tokenListRes = await axios({
  //     method: 'get',
  //     url: `${baseURL}/dtxtokenregistry/list`,
  //     headers: {
  //       Authorization: token,
  //     },
  //   })
  //   assert.equal(tokenListRes.status, 200)
  //   const tokenAddress = _.get(tokenListRes, 'data.items[0].contractaddress')

  //   // Get streamregistry address: needed for approve calls
  //   const registryListRes = await axios({
  //     method: 'get',
  //     url: `${baseURL}/streamregistry/list`,
  //     headers: {
  //       Authorization: token,
  //     },
  //   })
  //   assert.equal(registryListRes.status, 200)
  //   const streamRegistryAddress = _.get(registryListRes, 'data.base.key')

  //   // Create IPFS for stream enlisting
  //   const streamIpfsRes = await axios({
  //     method: 'post',
  //     url: `${baseURL}/ipfs/add/json`,
  //     data: metadata,
  //     headers: {
  //       Authorization: token,
  //     },
  //   })
  //   assert.equal(streamIpfsRes.status, 200)
  //   const streamIpfsHash = _.get(streamIpfsRes, 'data[0].hash')

  //   // Approve the stake amount first, before enlisting
  //   const enlistApproveRes = await axios({
  //     method: 'post',
  //     url: `${baseURL}/dtxtoken/${tokenAddress}/approve`,
  //     data: {
  //       spender: streamRegistryAddress,
  //       value: '10',
  //     },
  //     headers: {
  //       Authorization: token,
  //     },
  //   })
  //   assert.equal(enlistApproveRes.status, 200)

  //   // Enlist
  //   const enlistRes = await axios({
  //     method: 'post',
  //     url: `${baseURL}/streamregistry/enlist`,
  //     data: {
  //       price: '1',
  //       stakeamount: '10',
  //       metadata: streamIpfsHash,
  //     },
  //     headers: {
  //       Authorization: token,
  //     },
  //   })
  //   assert.equal(enlistRes.status, 200)

  //   // Save stream address for challenge/denying challenge
  //   const event = _.filter(
  //     enlistRes.data.events,
  //     log => log.event === 'Enlisted'
  //   )[0]
  //   const streamAddress = event.listing

  //   /*
  //   * CREATE CHALLENGER USER
  //   */

  //   // Create new user
  //   const challengerWalletRes = await axios({
  //     method: 'post',
  //     url: `${baseURL}/wallet`,
  //     data: {
  //       email: 'silke@databrokerdao.com',
  //       password: 'dbdao',
  //     },
  //   })
  //   const challengerPrivateKey = _.get(challengerWalletRes, 'data.privateKey')

  //   // Authenticate with this user
  //   const challengerAuthRes = await axios({
  //     method: 'post',
  //     url: `${baseURL}/authenticate`,
  //     data: {
  //       privateKeys: {
  //         ethereum: challengerPrivateKey,
  //       },
  //       encrypted: false,
  //     },
  //   })
  //   const challengerToken = _.get(challengerAuthRes, 'data.token')

  //   // Mint 1000 DTX for the new user
  //   const mintRes = await axios({
  //     method: 'post',
  //     url: `${baseURL}/dtxminter/mint`,
  //     data: {
  //       amount: (1000 * Math.pow(10, 18)).toString(), // 1000 DTX, taking the 18 decimals into account
  //     },
  //     headers: {
  //       Authorization: challengerToken,
  //     },
  //   })
  //   assert.equal(mintRes.status, 200)

  //   /*
  //   * CHALLENGE
  //   */

  //   // Approve first
  //   const challengeApproveRes = await axios({
  //     method: 'post',
  //     url: `${baseURL}/dtxtoken/${tokenAddress}/approve`,
  //     data: {
  //       spender: streamRegistryAddress,
  //       value: '5',
  //     },
  //     headers: {
  //       Authorization: challengerToken,
  //     },
  //   })
  //   assert.equal(challengeApproveRes.status, 200)

  //   // Challenge
  //   const challengeRes = await axios({
  //     method: 'post',
  //     url: `${baseURL}/streamregistry/challenge`,
  //     data: {
  //       listing: streamAddress,
  //       stakeamount: '5',
  //     },
  //     headers: {
  //       Authorization: challengerToken,
  //     },
  //   })
  //   assert.equal(challengeRes.status, 200)

  //   /*
  //   * AUTH CURATOR USER
  //   */

  //   // Get all wallets
  //   const getWalletsRes = await axios({
  //     method: 'get',
  //     url: `${baseURL}/keystorage/wallets`,
  //     headers: {
  //       Authorization: token,
  //     },
  //   })

  //   // Filter out admin: has curator role
  //   const curator = _.filter(
  //     _.get(getWalletsRes, 'data.wallets'),
  //     wallet => wallet.wallet.ethereum.address === accounts[0]
  //   )[0]
  //   const curatorPrivateKey = _.get(curator, 'mnemonicHash')

  //   // Authenticate with this user
  //   const curatorAuthRes = await axios({
  //     method: 'post',
  //     url: `${baseURL}/authenticate`,
  //     data: {
  //       privateKeys: {
  //         ethereum: curatorPrivateKey,
  //       },
  //       encrypted: false,
  //     },
  //   })
  //   const curatorToken = _.get(curatorAuthRes, 'data.token')

  //   /*
  //     * APPROVE CHALLENGE
  //     */
  //   const approveChallengeRes = await axios({
  //     method: 'post',
  //     url: `${baseURL}/streamregistry/approvechallenge`,
  //     data: {
  //       listing: streamAddress,
  //     },
  //     headers: {
  //       Authorization: curatorToken,
  //     },
  //   })
  //   assert.equal(approveChallengeRes.status, 200)
  // })

  it('should give DTX to data owner when challenge is denied', async () => {
    /*
    * ENLIST
    */

    // Get token address: needed for approve calls
    const tokenListRes = await axios({
      method: 'get',
      url: `${baseURL}/dtxtokenregistry/list`,
      headers: {
        Authorization: token,
      },
    })
    assert.equal(tokenListRes.status, 200)
    const tokenAddress = _.get(tokenListRes, 'data.items[0].contractaddress')

    // Get streamregistry address: needed for approve calls
    const registryListRes = await axios({
      method: 'get',
      url: `${baseURL}/streamregistry/list`,
      headers: {
        Authorization: token,
      },
    })
    assert.equal(registryListRes.status, 200)
    const streamRegistryAddress = _.get(registryListRes, 'data.base.key')

    // Create IPFS for stream enlisting
    const streamIpfsRes = await axios({
      method: 'post',
      url: `${baseURL}/ipfs/add/json`,
      data: metadata,
      headers: {
        Authorization: token,
      },
    })
    assert.equal(streamIpfsRes.status, 200)
    const streamIpfsHash = _.get(streamIpfsRes, 'data[0].hash')

    // Approve the stake amount first, before enlisting
    const enlistApproveRes = await axios({
      method: 'post',
      url: `${baseURL}/dtxtoken/${tokenAddress}/approve`,
      data: {
        spender: streamRegistryAddress,
        value: '10',
      },
      headers: {
        Authorization: token,
      },
    })
    assert.equal(enlistApproveRes.status, 200)

    // Enlist
    const enlistRes = await axios({
      method: 'post',
      url: `${baseURL}/streamregistry/enlist`,
      data: {
        price: '1',
        stakeamount: '10',
        metadata: streamIpfsHash,
      },
      headers: {
        Authorization: token,
      },
    })
    assert.equal(enlistRes.status, 200)

    // Save stream address for challenge/denying challenge
    const event = _.filter(
      enlistRes.data.events,
      log => log.event === 'Enlisted'
    )[0]
    const streamAddress = event.listing

    /*
    * CREATE CHALLENGER USER
    */

    // Create new user
    const challengerWalletRes = await axios({
      method: 'post',
      url: `${baseURL}/wallet`,
      data: {
        email: 'silke@databrokerdao.com',
        password: 'dbdao',
      },
    })
    const challengerPrivateKey = _.get(challengerWalletRes, 'data.privateKey')

    // Authenticate with this user
    const challengerAuthRes = await axios({
      method: 'post',
      url: `${baseURL}/authenticate`,
      data: {
        privateKeys: {
          ethereum: challengerPrivateKey,
        },
        encrypted: false,
      },
    })
    const challengerToken = _.get(challengerAuthRes, 'data.token')

    // Mint 1000 DTX for the new user
    const mintRes = await axios({
      method: 'post',
      url: `${baseURL}/dtxminter/mint`,
      data: {
        amount: (1000 * Math.pow(10, 18)).toString(), // 1000 DTX, taking the 18 decimals into account
      },
      headers: {
        Authorization: challengerToken,
      },
    })
    assert.equal(mintRes.status, 200)

    /*
    * CHALLENGE
    */

    // Approve first
    const challengeApproveRes = await axios({
      method: 'post',
      url: `${baseURL}/dtxtoken/${tokenAddress}/approve`,
      data: {
        spender: streamRegistryAddress,
        value: '5',
      },
      headers: {
        Authorization: challengerToken,
      },
    })
    assert.equal(challengeApproveRes.status, 200)

    // Challenge
    const challengeRes = await axios({
      method: 'post',
      url: `${baseURL}/streamregistry/challenge`,
      data: {
        listing: streamAddress,
        stakeamount: '5',
      },
      headers: {
        Authorization: challengerToken,
      },
    })
    assert.equal(challengeRes.status, 200)

    /*
    * AUTH CURATOR USER
    */

    // Get all wallets
    const getWalletsRes = await axios({
      method: 'get',
      url: `${baseURL}/keystorage/wallets`,
      headers: {
        Authorization: token,
      },
    })

    // Filter out admin: has curator role
    const curator = _.filter(
      _.get(getWalletsRes, 'data.wallets'),
      wallet => wallet.wallet.ethereum.address === accounts[0]
    )[0]
    const curatorPrivateKey = _.get(curator, 'mnemonicHash')

    // Authenticate with this user
    const curatorAuthRes = await axios({
      method: 'post',
      url: `${baseURL}/authenticate`,
      data: {
        privateKeys: {
          ethereum: curatorPrivateKey,
        },
        encrypted: false,
      },
    })
    const curatorToken = _.get(curatorAuthRes, 'data.token')

    try {
      /*
      * DENY CHALLENGE
      */
      const denyRes = await axios({
        method: 'post',
        url: `${baseURL}/streamregistry/denychallenge`,
        data: {
          listing: streamAddress,
        },
        headers: {
          Authorization: curatorToken,
        },
      })
      assert.equal(denyRes.status, 200)
    } catch (e) {
      console.log('--', e)
    }
  })
})
