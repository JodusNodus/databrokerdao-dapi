const { createPermission, grantPermission } = require('./helpers/permissions')

const StreamRegistry = artifacts.require('StreamRegistry.sol')
const StreamFactory = artifacts.require('StreamFactory.sol')
const Token = artifacts.require('DtxToken.sol')
const GateKeeper = artifacts.require('GateKeeper')

async function enlistStreams(deployer, network, accounts) {
  const registry = await StreamRegistry.deployed()
  const token = await Token.deployed()
  await token.approve(accounts[0], '10', {
    from: accounts[0],
  })

  const metadata = {
    name: 'Air quality sensor Leuven',
    geo: {
      lat: 1.922323131232321,
      lng: 0.32423434343244,
    },
    category: 'Air quality',
  }

  await registry.enlist('10', '10', JSON.stringify(metadata), {
    from: accounts[0],
  })
}

async function deployRegistry(deployer, network, accounts) {
  const dGateKeeper = await GateKeeper.deployed()
  const dDtxToken = await Token.deployed()
  let dTokenCuratedRegistry

  let mintPermissionHolder

  async function approveRegistryFor(addresses, index) {
    const user = addresses[index]

    // Create mint permission on token: only the first account will get the mint role.
    // We will mint tokens for the other addresses with this account.
    if (index === 0) {
      mintPermissionHolder = user
      await createPermission(
        dGateKeeper,
        mintPermissionHolder,
        dDtxToken,
        'MINT_ROLE',
        mintPermissionHolder
      )
    }

    // Mint tokens for user
    await dDtxToken.mint(user, 1000, {
      from: mintPermissionHolder,
    })
    const balanceOfUser = await dDtxToken.balanceOf(user)

    // Approve tokens
    await dDtxToken.approve(StreamRegistry.address, balanceOfUser, {
      from: user,
    })

    if (index < addresses.length - 1) {
      index++
      return approveRegistryFor(addresses, index)
    }

    return true
  }

  await deployer.deploy(StreamFactory, dGateKeeper.address)
  const dStreamFactory = await StreamFactory.deployed()

  await grantPermission(
    dGateKeeper,
    dGateKeeper,
    'CREATE_PERMISSIONS_ROLE',
    dStreamFactory.address
  )

  await deployer.deploy(
    StreamRegistry,
    dGateKeeper.address,
    dDtxToken.address,
    dStreamFactory.address
  )
  dTokenCuratedRegistry = await StreamRegistry.deployed()

  await approveRegistryFor(accounts, 0)

  // Set admin permissions: only on first account, since this is the admin.
  // See migrations step 3.
  await createPermission(
    dGateKeeper,
    accounts[0],
    dTokenCuratedRegistry,
    'WITHDRAW_FUNDS_ROLE',
    accounts[0]
  )

  // Set curator permissions.
  await createPermission(
    dGateKeeper,
    accounts[0],
    dTokenCuratedRegistry,
    'CURATE_CHALLENGE_ROLE',
    accounts[0]
  )

  // Enlist a stream
  await enlistStreams(deployer, network, accounts)
}

module.exports = async (deployer, network, accounts) => {
  deployer
    .then(function() {
      return deployRegistry(deployer, network, accounts)
    })
    .catch(error => {
      console.log(error)
      process.exit(1)
    })
}
