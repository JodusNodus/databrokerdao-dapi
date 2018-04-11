const { grantPermission, createPermission } = require('./helpers/permissions')

const SensorRegistry = artifacts.require('SensorRegistry')
const PurchaseRegistry = artifacts.require('PurchaseRegistry')
const Token = artifacts.require('DtxToken')
const GateKeeper = artifacts.require('GateKeeper')

const { authenticate, addIpfs } = require('./helpers/api')

async function purchaseSensor(deployer, network, accounts) {
  const purchase = await PurchaseRegistry.deployed()
  const token = await Token.deployed()

  // Add metadata
  const metadata = {
    data: {
      email: 'silke@databrokerdao.com',
    },
  }

  // Authenticate
  const authToken = await authenticate(network)

  if (authToken) {
    // Add metadata as ipfs
    const ipfsHash = await addIpfs(metadata, authToken, network)

    // Get sensor address
    const sensorAddress = process.env.SENSOR_ADDRESS
    // Calculate endtime
    const endtime = Math.floor(new Date().getTime() / 1000) + 60 // one minute from now

    // First, approve!
    await token.approve(purchase.address, '1000', {
      from: accounts[0],
    })

    await purchase.purchaseAccess(sensorAddress, endtime, ipfsHash, {
      from: accounts[0],
    })
  } else {
    console.log('AUTH FAILED: not going forward with demo purchase')
  }
}

async function deployPurchasing(deployer, network, accounts) {
  const dGateKeeper = await GateKeeper.deployed()
  const dDtxToken = await Token.deployed()
  const dSensorRegistry = await SensorRegistry.deployed()

  await deployer.deploy(
    PurchaseRegistry,
    dGateKeeper.address,
    dDtxToken.address,
    dSensorRegistry.address
  )
  const dPurchaseRegistry = await PurchaseRegistry.deployed()

  // Grant permission to create permissions:
  await grantPermission(
    dGateKeeper,
    dGateKeeper,
    'CREATE_PERMISSIONS_ROLE',
    dPurchaseRegistry.address
  )

  // Give admin permission to change settings
  await createPermission(
    dGateKeeper,
    accounts[0],
    dPurchaseRegistry, // purchase registry
    'CHANGE_SETTINGS_ROLE',
    accounts[0]
  )
  await createPermission(
    dGateKeeper,
    accounts[0],
    dSensorRegistry, // sensor registry
    'CHANGE_SETTINGS_ROLE',
    accounts[0]
  )

  await purchaseSensor(deployer, network, accounts)
}

module.exports = async (deployer, network, accounts) => {
  deployer
    .then(function(a) {
      return deployPurchasing(deployer, network, accounts)
    })
    .catch(error => {
      console.log(error)
      process.exit(1)
    })
}
