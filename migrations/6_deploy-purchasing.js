const { grantPermission } = require('./helpers/permissions')

const StreamRegistry = artifacts.require('StreamRegistry.sol')
const PurchaseRegistry = artifacts.require('PurchaseRegistry.sol')
const Token = artifacts.require('DtxToken.sol')
const GateKeeper = artifacts.require('GateKeeper')

const {
  GATEWAY_OPERATOR_ADDRESS,
  GATEWAY_OPERATOR_PRIVATE_KEY,
  getBaseUrl,
  authenticate,
  addIpfs,
} = require('./helpers/api')

async function purchaseStream(deployer, network, accounts) {
  const registry = await StreamRegistry.deployed()
  const purchase = await PurchaseRegistry.deployed()
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

  // Authenticate
  const authToken = await authenticate(network)
  // Add metadata as ipfs
  const ipfsHash = await addIpfs(metadata, authToken, network)

  // First, approve!
  await token.approve(purchase.address, '1000', {
    from: accounts[0],
  })
}

async function deployPurchasing(deployer, network, accounts) {
  const dGateKeeper = await GateKeeper.deployed()
  const dDtxToken = await Token.deployed()
  const dTokenCuratedRegistry = await StreamRegistry.deployed()

  await deployer.deploy(
    PurchaseRegistry,
    dGateKeeper.address,
    dDtxToken.address,
    dTokenCuratedRegistry.address
  )
  const dRegistry = await PurchaseRegistry.deployed()

  // Grant permission to create permissions:
  await grantPermission(
    dGateKeeper,
    dGateKeeper,
    'CREATE_PERMISSIONS_ROLE',
    dRegistry.address
  )

  await purchaseStream(deployer, network, accounts)
}

module.exports = async (deployer, network, accounts) => {
  deployer
    .then(function() {
      return deployPurchasing(deployer, network, accounts)
    })
    .catch(error => {
      console.log(error)
      process.exit(1)
    })
}
