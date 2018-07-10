const Token = artifacts.require('DtxToken.sol')
const TokenMinter = artifacts.require('DtxMinter.sol')
const GateKeeper = artifacts.require('GateKeeper.sol')
const { createPermission } = require('./helpers/permissions')

async function performMigration(deployer, network, accounts) {
  const dGateKeeper = await GateKeeper.deployed()
  const dToken = await Token.deployed()

  try {
    // Deploy minter
    await deployer.deploy(TokenMinter, dToken.address, dGateKeeper.address)
    const dTokenMinter = await TokenMinter.deployed()

    // Grant permission to mint
    await createPermission(
      dGateKeeper,
      accounts[0],
      dToken,
      'MINT_ROLE',
      dTokenMinter.address
    )
  } catch (e) {
    console.log(e)
  }
}

module.exports = function(deployer, network, accounts) {
  deployer
    .then(() => performMigration(deployer, network, accounts))
    .catch(error => {
      console.log(error)
      process.exit(1)
    })
}
