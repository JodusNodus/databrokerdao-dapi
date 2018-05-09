const _ = require('lodash')

const { createPermission, grantPermission } = require('./helpers/permissions')
const {
  GATEWAY_OPERATOR_ADDRESS,
  authenticate,
  addIpfs,
} = require('./helpers/api')

const ChallengeRegistry = artifacts.require('ChallengeRegistry.sol')
const SensorRegistry = artifacts.require('SensorRegistry.sol')
const SensorRegistryDispatcher = artifacts.require(
  'SensorRegistryDispatcher.sol'
)
const SensorFactory = artifacts.require('SensorFactory.sol')
const Token = artifacts.require('DtxToken.sol')
const GateKeeper = artifacts.require('GateKeeper')

async function enlistSensor(deployer, network, accounts) {
  const dSensorRegistry = await SensorRegistry.deployed()
  const dToken = await Token.deployed()

  // Add metadata
  const metadata = {
    data: {
      name: 'Temperature outside Bar Berlin',
      geo: {
        lat: 50.880722,
        lng: 4.692725,
        // type: 'Point',
        // coordinates: [4.692725, 50.880722],
      },
      type: 'temperature',
      example: "{'value':11,'unit':'celsius'}",
      updateinterval: 60000,
    },
  }

  // Authenticate
  const authToken = await authenticate(network)

  if (authToken) {
    // Add metadata as ipfs
    const ipfsHash = await addIpfs(metadata, authToken, network)

    // First, approve!
    await dToken.approve(dSensorRegistry.address, '10000000000000000000', {
      from: accounts[0],
    })

    // Enlist
    const tx = await dSensorRegistry.enlist(
      '10000000000000000000',
      '10',
      ipfsHash || '',
      {
        from: accounts[0],
      }
    )

    const event = _.filter(tx.logs, log => log.event === 'Enlisted')[0]
    const sensorAddress = event.args.listing
    process.env.SENSOR_ADDRESS = sensorAddress // Setting it in env variables to pass it to next migration
  } else {
    console.log('AUTH FAILED: not enlisting demo sensor')
  }
}

async function approveRegistryFor(addresses, dDtxToken, index) {
  const user = addresses[index]
  // Mint tokens for user
  await dDtxToken.mint(user, 100000000000000000000, {
    from: addresses[0],
  })
  const balanceOfUser = await dDtxToken.balanceOf(user)
  // Approve tokens
  await dDtxToken.approve(SensorRegistry.address, balanceOfUser, {
    from: user,
  })
  if (index < addresses.length - 1) {
    index++
    return approveRegistryFor(addresses, index)
  }
}

async function deployRegistry(deployer, network, accounts) {
  const dGateKeeper = await GateKeeper.deployed()
  const dDtxToken = await Token.deployed()

  // Deploy registry for challenges
  await deployer.deploy(ChallengeRegistry, dGateKeeper.address)
  const dChallengeRegistry = await ChallengeRegistry.deployed()

  // Deploy factory for sensors: we use this design pattern to make sure we can use the interfaces
  // for the listings in the TCR
  await deployer.deploy(SensorFactory, dGateKeeper.address)
  const dSensorFactory = await SensorFactory.deployed()

  await grantPermission(
    dGateKeeper,
    dGateKeeper,
    'CREATE_PERMISSIONS_ROLE',
    dSensorFactory.address
  )

  // Deploy sensor registry dispatcher, and grant permissions
  await deployer.deploy(
    SensorRegistryDispatcher,
    dGateKeeper.address,
    dDtxToken.address,
    dSensorFactory.address,
    dChallengeRegistry.address,
    10, // minimum enlist amount (in wDTX)
    5, // minimum challenge amount (in wDTX)
    10 // curator percentage
  )
  const dSensorRegistryDispatcher = await SensorRegistryDispatcher.deployed()
  await createPermission(
    dGateKeeper,
    accounts[0],
    dSensorRegistryDispatcher,
    'UPGRADE_CONTRACT',
    accounts[0]
  )

  // Deploy sensor registry
  await deployer.deploy(
    SensorRegistry,
    dGateKeeper.address,
    dDtxToken.address,
    dSensorFactory.address,
    dChallengeRegistry.address,
    10, // minimum enlist amount (in wDTX)
    5, // minimum challenge amount (in wDTX)
    10 // curator percentage
  )
  const dSensorRegistry = await SensorRegistry.deployed()

  // Set sensor registry address in dispatcher
  dSensorRegistryDispatcher.setTarget(dSensorRegistry.address)

  // Grant sensor registry permission to create permissions:
  await grantPermission(
    dGateKeeper,
    dGateKeeper,
    'CREATE_PERMISSIONS_ROLE',
    dSensorRegistry.address
  )

  // Grant mint permission: we will mint in approveRegistryFor
  await grantPermission(dGateKeeper, dDtxToken, 'MINT_ROLE', accounts[0])
  await approveRegistryFor(accounts, dDtxToken, 0)

  // Mint tokens for gateway operator user
  await dDtxToken.mint(GATEWAY_OPERATOR_ADDRESS, Math.pow(1000000, 10), {
    from: accounts[0],
  })

  // Set admin permissions: only on first account, since this is the admin.
  // See migrations step 3.
  await createPermission(
    dGateKeeper,
    accounts[0],
    dSensorRegistry,
    'WITHDRAW_FUNDS_ROLE',
    accounts[0]
  )
  await createPermission(
    dGateKeeper,
    accounts[0],
    dSensorRegistry,
    'CURATE_CHALLENGE_ROLE',
    accounts[0]
  )

  // Enlist a sensor!
  // await enlistSensor(deployer, network, accounts)
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
