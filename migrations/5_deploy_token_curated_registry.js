const axios = require('axios')

const { createPermission, grantPermission } = require('./helpers/permissions')

const StreamRegistry = artifacts.require('StreamRegistry.sol')
const StreamFactory = artifacts.require('StreamFactory.sol')
const Token = artifacts.require('DtxToken.sol')
const GateKeeper = artifacts.require('GateKeeper')

const GATEWAY_OPERATOR_PRIVATE_KEY =
  'ca1398820695e93cea849b841a9aae4eeae65518d14353ab73d21fa4af2d58a7'
const GATEWAY_OPERATOR_ADDRESS = '0x3df2fd51cf19c0d8d1861d6ebc6457a1b0c7496f'

function getBaseUrl(network) {
  switch (network) {
    case 'development':
      return 'http://localhost:3333'
    case 'minttestnet':
      return 'https://dapi-staging.databrokerdao.com'
    case 'mintnet':
      return 'https://dapi.databrokerdao.com'
    default:
      return 'http://localhost:3333'
  }
}

async function enlistStreams(deployer, network, accounts) {
  const registry = await StreamRegistry.deployed()
  const token = await Token.deployed()

  // Add metadata
  const metadata = {
    data: {
      name: 'Temperature outside Bar Berlin',
      geo: {
        type: 'Point',
        coordinates: [4.692725, 50.880722],
      },
      type: 'temperature',
      example: "{'value':11,'unit':'celsius'}",
      updateinterval: 60000,
    },
  }

  // Authenticate
  const authToken = await authenticate(network)
  // Add metadata as ipfs
  const ipfsHash = await addIpfs(metadata, authToken, network)

  // First, approve!
  await token.approve(registry.address, '10', {
    from: accounts[0],
  })
  await registry.enlist('10', '10', ipfsHash || '', {
    from: accounts[0],
  })
}

async function authenticate(network) {
  try {
    const res = await axios({
      url: `${getBaseUrl(network)}/authenticate`,
      method: 'POST',
      data: {
        privateKeys: {
          ethereum: GATEWAY_OPERATOR_PRIVATE_KEY,
        },
        encrypted: false,
      },
    })

    return res.data.token
  } catch (e) {
    console.log('Authenticate failed: ', e)
  }
}

async function addIpfs(metadata, token, network) {
  try {
    const res = await axios({
      url: `${getBaseUrl(network)}/ipfs/add/json`,
      method: 'POST',
      data: metadata,
      headers: {
        Authorization: token,
      },
    })
    return res.data[0].hash
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

  // Mint tokens for gateway operator user
  await dDtxToken.mint(GATEWAY_OPERATOR_ADDRESS, Math.pow(10, 10), {
    from: mintPermissionHolder,
  })

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

  // Enlist a stream!
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
