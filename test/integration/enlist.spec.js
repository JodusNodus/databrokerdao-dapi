const fetch = require('node-fetch')

const getEventProperty = require('../helpers/getEventProperty')

const gatewayOperator = 0x3df2fd51cf19c0d8d1861d6ebc6457a1b0c7496f

contract('The enlist integration test', accounts => {
  it('works', async () => {
    // Add metadata
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

    // Authenticate
    const authToken = await authenticate()
    // Add metadata as ipfs
    const ipfsHash = await addIpfs(metadata, authToken)

    const t = await approve(gatewayOperator, gatewayOperator, '10')
    const tx = await enlist('10', '10', ipfsHash)
  })
})

async function approve(address, spender, value) {
  try {
    return await fetch(`http://localhost:3333/${address}/approve`, {
      method: 'POST',
      body: JSON.stringify({
        spender,
        value,
      }),
    })
      .then(res => res.json())
      .then(json => json.token)
  } catch (e) {
    console.log('Enlist failed: ', e)
  }
}

async function enlist(stakeamount, price, metadata) {
  try {
    return await fetch(`http://localhost:3333/enlist`, {
      method: 'POST',
      body: JSON.stringify({
        stakeamount,
        price,
        metadata,
      }),
    })
      .then(res => res.json())
      .then(json => json.token)
  } catch (e) {
    console.log('Enlist failed: ', e)
  }
}

async function authenticate() {
  try {
    return await fetch(`http://localhost:3333/authenticate`, {
      method: 'POST',
      body: JSON.stringify({
        privateKeys: {
          ethereum:
            '2865d7012de2a6b5af3efa222e8606c2086842233a69e134f392dc20820452e9',
        },
        encrypted: false,
      }),
    })
      .then(res => res.json())
      .then(json => json.token)
  } catch (e) {
    console.log('Authenticate failed: ', e)
  }
}

async function addIpfs(metadata, token) {
  try {
    return await fetch(`http://localhost:3333/ipfs/add/json`, {
      method: 'POST',
      body: JSON.stringify(metadata),
      headers: {
        Authorization: token,
      },
    })
      .then(res => res.json())
      .then(json => json[0].hash)
  } catch (e) {
    console.log('AddIpfs failed: ', e)
  }
}
