const ForeignBridge = artifacts.require('ForeignBridge')
const config = require('../bridge-config')
const HDWalletProvider = require('truffle-hdwallet-provider')
const GateKeeper = artifacts.require('GateKeeper.sol')
const Token = artifacts.require('LocalDTXToken')
const { grantPermission } = require('./helpers/permissions')

async function performMigration(deployer, network, accounts) {
  const validators = config.validatorSeeds.map(seedToAddress)
  await deployer.deploy(ForeignBridge, config.requiredValidators, validators)

  const dGateKeeper = await GateKeeper.deployed()
  const dForeignBridge = await ForeignBridge.deployed()
  const dToken = await Token.deployed()

  await grantPermission(
    dGateKeeper,
    dToken,
    'MINT_ROLE',
    dForeignBridge.address
  )
  await grantPermission(
    dGateKeeper,
    dToken,
    'BURN_ROLE',
    dForeignBridge.address
  )

  dForeignBridge.registerToken(
    '0x765f0c16d1ddc279295c1a7c24b0883f62d33f75',
    dToken.address
  )
}

module.exports = function(deployer, network, accounts) {
  deployer
    .then(() => performMigration(deployer, network, accounts))
    .catch(error => {
      console.log(error)
      process.exit(1)
    })
}

function seedToAddress(seed) {
  const provider = new HDWalletProvider(seed)
  return provider.getAddresses()[0]
}
