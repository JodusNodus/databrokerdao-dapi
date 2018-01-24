const DtxToken = artifacts.require('DtxToken.sol')
const DtxTokenRegistry = artifacts.require('DtxTokenRegistry.sol')
const GateKeeper = artifacts.require('GateKeeper')

async function deployTokenSystem(deployer, network, accounts) {
  const dGateKeeper = await GateKeeper.deployed()

  try {
    // Deploy token registry
    await deployer.deploy(DtxTokenRegistry, dGateKeeper.address)
    const dRegistry = await DtxTokenRegistry.deployed()

    // Deploy token
    await deployer.deploy(
      DtxToken,
      'DTX',
      18,
      dRegistry.address,
      dGateKeeper.address
    )
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
