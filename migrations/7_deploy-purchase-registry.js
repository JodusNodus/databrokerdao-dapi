const { grantPermission, createPermission } = require('./helpers/permissions')

const SensorRegistry = artifacts.require('SensorRegistry.sol')
const PurchaseRegistry = artifacts.require('PurchaseRegistry.sol')
const PurchaseRegistryDispatcher = artifacts.require(
  'PurchaseRegistryDispatcher.sol'
)
const Token = artifacts.require('DtxToken.sol')
const GateKeeper = artifacts.require('GateKeeper.sol')

// const { authenticate, addIpfs } = require('./helpers/api')

// async function purchaseSensor(deployer, network, accounts) {
//   const purchase = await PurchaseRegistry.deployed()
//   const token = await Token.deployed()

//   // Add metadata
//   const metadata = {
//     data: {
//       email: 'silke@databrokerdao.com',
//     },
//   }

//   // Authenticate
//   const authToken = await authenticate(network)

//   if (authToken) {
//     // Add metadata as ipfs
//     const ipfsHash = await addIpfs(metadata, authToken, network)

//     // Get sensor address
//     const sensorAddress = process.env.SENSOR_ADDRESS
//     // Calculate endtime
//     const endtime = Math.floor(new Date().getTime() / 1000) + 60 // one minute from now

//     // First, approve!
//     await token.approve(purchase.address, '1000', {
//       from: accounts[0],
//     })

//     await purchase.purchaseAccess(sensorAddress, endtime, ipfsHash, {
//       from: accounts[0],
//     })
//   } else {
//     console.log('AUTH FAILED: not going forward with demo purchase')
//   }
// }

async function performMigration(deployer, network, accounts) {
  const dGateKeeper = await GateKeeper.deployed()
  const dDtxToken = await Token.deployed()
  const dSensorRegistry = await SensorRegistry.deployed()

  // Deploy purchase registry dispatcher, and grant permissions
  await deployer.deploy(
    PurchaseRegistryDispatcher,
    dGateKeeper.address,
    dDtxToken.address,
    dSensorRegistry.address
  )
  const dPurchaseRegistryDispatcher = await PurchaseRegistryDispatcher.deployed()
  await createPermission(
    dGateKeeper,
    accounts[0],
    dPurchaseRegistryDispatcher,
    'UPGRADE_CONTRACT',
    accounts[0]
  )

  // Deploy purchase registry
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

  // Set purchase registry address in dispatcher
  await dPurchaseRegistryDispatcher.setTarget(dPurchaseRegistry.address)

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

  // await purchaseSensor(deployer, network, accounts)
}

module.exports = function(deployer, network, accounts) {
  deployer
    .then(() => performMigration(deployer, network, accounts))
    .catch(error => {
      console.log(error)
      process.exit(1)
    })
}
