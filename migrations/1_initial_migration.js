var Migrations = artifacts.require('./Migrations.sol')

async function performMigration(deployer, network, accounts) {
  await deployer.deploy(Migrations)
}

module.exports = function(deployer, network, accounts) {
  deployer
    .then(() => performMigration(deployer, network, accounts))
    .catch(error => {
      console.log(error)
      process.exit(1)
    })
}
