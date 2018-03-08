const Token = artifacts.require('DtxToken.sol')
const TokenRegistry = artifacts.require('DtxTokenRegistry.sol')
const GateKeeper = artifacts.require('GateKeeper')

async function deployTokenSystem(deployer, network, accounts) {
  const dGateKeeper = await GateKeeper.deployed()

  try {
    // Deploy token registry
    await deployer.deploy(TokenRegistry, dGateKeeper.address)
    const dRegistry = await TokenRegistry.deployed()

    // Deploy token
    await deployer.deploy(
      Token,
      'DTX',
      18,
      dRegistry.address,
      dGateKeeper.address
    )

    await dRegistry.addToken('DTX', Token.address)
  } catch (e) {
    console.log(e)
  }
}

module.exports = (deployer, network, accounts) => {
  deployer
    .then(function() {
      return deployTokenSystem(deployer, network, accounts)
    })
    .catch(error => {
      console.log(error)
      process.exit(1)
    })
}
