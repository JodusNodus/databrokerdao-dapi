const Administrators = artifacts.require('Administrators')
const Curators = artifacts.require('Curators')
const GateKeeper = artifacts.require('GateKeeper')

const mintrc = require('../mintrc')
const {
  deployRoleRegistry,
  createAccounts,
} = require('@settlemint/solidity-mint')

async function performMigration(deployer, network, accounts) {
  console.log('--', accounts)

  const dGateKeeper = await GateKeeper.deployed()

  // Administrator
  await deployRoleRegistry(deployer, Administrators, dGateKeeper, accounts[0])
  const DeployedAdministrators = await Administrators.deployed()
  await createAccounts(
    1,
    {
      prefix: 'admin',
      postfix: '@settlemint.com',
    },
    DeployedAdministrators,
    network === 'development'
      ? 'robot robot robot robot robot robot robot robot robot robot robot robot'
      : 'discover cousin hover skin skirt original crane spatial wrong barely keep jump',
    mintrc.environments
  )

  // Curators: curate challenges
  await deployRoleRegistry(deployer, Curators, dGateKeeper, accounts[0])
  const DeployedCurators = await Curators.deployed()
  await createAccounts(
    2,
    {
      prefix: 'curator',
      postfix: '@settlemint.com',
    },
    DeployedCurators,
    network === 'development'
      ? 'robot robot robot robot robot robot robot robot robot robot robot robot'
      : 'discover cousin hover skin skirt original crane spatial wrong barely keep jump',
    mintrc.environments
  )
}

module.exports = function(deployer, network, accounts) {
  deployer
    .then(function() {
      return performMigration(deployer, network, accounts)
    })
    .catch(error => {
      console.log(error)
      process.exit(1)
    })
}
