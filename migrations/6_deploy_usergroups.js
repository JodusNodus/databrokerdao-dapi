const Administrators = artifacts.require('Administrators')
const Curators = artifacts.require('Curators')
const GateKeeper = artifacts.require('GateKeeper')
const StreamRegistry = artifacts.require('StreamRegistry')

const _ = require('lodash')

const { createPermission } = require('./helpers/permissions')
const mintrc = require('../mintrc')
const {
  deployRoleRegistry,
  createAccounts,
} = require('@settlemint/solidity-mint')

async function performMigration(deployer, network, accounts) {
  const dGateKeeper = await GateKeeper.deployed()
  const dStreamRegistry = await StreamRegistry.deployed()

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
  const curators = await createAccounts(
    1,
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
  // Give curators the curate permission
  _.each(curators, async curator => {
    const address = curator.getAddressString()

    await createPermission(
      dGateKeeper,
      accounts[0],
      dStreamRegistry,
      'CURATE_CHALLENGE_ROLE',
      address
    )
  })
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
