const Token = artifacts.require('DtxToken.sol')
const TokenMinter = artifacts.require('DtxMinter.sol')
const GateKeeper = artifacts.require('GateKeeper')
const { createPermission } = require('./helpers/permissions')

async function deployTokenMinter(deployer, network, accounts) {
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

module.exports = (deployer, network, accounts) => {
  deployer
    .then(function() {
      return deployTokenMinter(deployer, network, accounts)
    })
    .catch(error => {
      console.log(error)
      process.exit(1)
    })
}
