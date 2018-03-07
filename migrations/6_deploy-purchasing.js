const { createPermission, grantPermission } = require('./helpers/permissions')

const StreamRegistry = artifacts.require('StreamRegistry.sol')
const PurchaseRegistry = artifacts.require('PurchaseRegistry.sol')
const Token = artifacts.require('DtxToken.sol')
const GateKeeper = artifacts.require('GateKeeper')

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
