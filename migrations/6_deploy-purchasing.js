const StreamRegistry = artifacts.require('StreamRegistry.sol')
const StreamPurchasing = artifacts.require('StreamPurchasing.sol')
const Token = artifacts.require('DtxToken.sol')
const GateKeeper = artifacts.require('GateKeeper')

async function deployPurchasing(deployer, network, accounts) {
  const dGateKeeper = await GateKeeper.deployed()
  const dDtxToken = await Token.deployed()
  const dTokenCuratedRegistry = await StreamRegistry.deployed()

  await deployer.deploy(
    StreamPurchasing,
    dGateKeeper.address,
    dDtxToken.address,
    dTokenCuratedRegistry.address
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
