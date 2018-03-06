const fetch = require('node-fetch')

const { createPermission, grantPermission } = require('./helpers/permissions')
const mintrc = require('../mintrc')

const StreamRegistry = artifacts.require('StreamRegistry.sol')
const StreamFactory = artifacts.require('StreamFactory.sol')
const Token = artifacts.require('DtxToken.sol')
const GateKeeper = artifacts.require('GateKeeper')

async function enlistStreams(deployer, network, accounts) {
  const registry = await StreamRegistry.deployed()
  const token = await Token.deployed()

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

  // for (let i = 0; i < mintrc.environments.length; i++) {
  // Authenticate
  const authToken = await authenticate(network)
  // Add metadata as ipfs
  const ipfsHash = await addIpfs(metadata, authToken)

  await token.approve(accounts[0], '10', {
    from: accounts[0],
  })
  await registry.enlist('10', '10', ipfsHash, {
    from: accounts[0],
  })
  // }
}

async function authenticate(network) {
  try {
    return await fetch(`${mintrc.environments[1]}/authenticate`, {
      method: 'POST',
      body: JSON.stringify({
        privateKeys: {
          ethereum:
            network === 'development'
              ? '04e9539c81b92eaf6ccb64ba3175367c749845219c2ef3a12fb1f0a0f288b6e4fd9847604cd41a442f9614661f9f24ed30d69e19269ceeec720fe8aa7e82b0c44b000000000000000000000000000000006089ba9c6c8985591a5aff31ce9da3e1f51a97738779c4a0f347a35a26d64fd50424cc714868f83cf3a4fdec1be230b3242d84f7646af9f2b1cb15bd4291c86e'
              : process.env.ETHEREUM_PRIVATE_KEY,
        },
        encrypted: true,
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
    return await fetch(`${mintrc.environments[0]}/ipfs/add/json`, {
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

async function deployRegistry(deployer, network, accounts) {
  const dGateKeeper = await GateKeeper.deployed()
  const dDtxToken = await Token.deployed()
  let dTokenCuratedRegistry

  let mintPermissionHolder

  async function approveRegistryFor(addresses, index) {
    const user = addresses[index]

    // Create mint permission on token: only the first account will get the mint role.
    // We will mint tokens for the other addresses with this account.
    if (index === 0) {
      mintPermissionHolder = user
      await createPermission(
        dGateKeeper,
        mintPermissionHolder,
        dDtxToken,
        'MINT_ROLE',
        mintPermissionHolder
      )
    }

    // Mint tokens for user
    await dDtxToken.mint(user, 1000, {
      from: mintPermissionHolder,
    })
    const balanceOfUser = await dDtxToken.balanceOf(user)

    // Approve tokens
    await dDtxToken.approve(StreamRegistry.address, balanceOfUser, {
      from: user,
    })

    if (index < addresses.length - 1) {
      index++
      return approveRegistryFor(addresses, index)
    }

    return true
  }

  await deployer.deploy(StreamFactory, dGateKeeper.address)
  const dStreamFactory = await StreamFactory.deployed()

  await grantPermission(
    dGateKeeper,
    dGateKeeper,
    'CREATE_PERMISSIONS_ROLE',
    dStreamFactory.address
  )

  await deployer.deploy(
    StreamRegistry,
    dGateKeeper.address,
    dDtxToken.address,
    dStreamFactory.address
  )
  dTokenCuratedRegistry = await StreamRegistry.deployed()

  await approveRegistryFor(accounts, 0)

  // Set admin permissions: only on first account, since this is the admin.
  // See migrations step 3.
  await createPermission(
    dGateKeeper,
    accounts[0],
    dTokenCuratedRegistry,
    'WITHDRAW_FUNDS_ROLE',
    accounts[0]
  )

  // Set curator permissions.
  await createPermission(
    dGateKeeper,
    accounts[0],
    dTokenCuratedRegistry,
    'CURATE_CHALLENGE_ROLE',
    accounts[0]
  )

  // Enlist a stream
  await enlistStreams(deployer, network, accounts)
}

module.exports = async (deployer, network, accounts) => {
  deployer
    .then(function() {
      return deployRegistry(deployer, network, accounts)
    })
    .catch(error => {
      console.log(error)
      process.exit(1)
    })
}
