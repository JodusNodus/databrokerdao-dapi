const { createPermission, grantPermission } = require('./helpers/permissions')

const SensorRegistry = artifacts.require('SensorRegistry.sol')
const Token = artifacts.require('DtxToken.sol')
const GateKeeper = artifacts.require('GateKeeper')

async function deployRegistry(deployer, network, accounts) {
  const dGateKeeper = await GateKeeper.deployed()
  const dDtxToken = await Token.deployed()
  let dTokenCuratedRegistry

  let mintPermissionHolder

  async function setUserPermissions(accounts, index) {
    if (index === 0) {
      await createPermission(
        dGateKeeper,
        accounts[0], // Admin
        dTokenCuratedRegistry,
        'CHALLENGE_ROLE',
        accounts[index]
      )

      await createPermission(
        dGateKeeper,
        accounts[0], // Admin
        dTokenCuratedRegistry,
        'ENLIST_ROLE',
        accounts[index]
      )
    }

    await grantPermission(
      dGateKeeper,
      dTokenCuratedRegistry,
      'CHALLENGE_ROLE',
      accounts[index]
    )

    await grantPermission(
      dGateKeeper,
      dTokenCuratedRegistry,
      'ENLIST_ROLE',
      accounts[index]
    )

    if (index < accounts.length - 1) {
      index++
      await setUserPermissions(accounts, index)
    }
  }

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
    await dDtxToken.approve(SensorRegistry.address, balanceOfUser, {
      from: user,
    })

    if (index < addresses.length - 1) {
      index++
      return approveRegistryFor(addresses, index)
    }

    return true
  }

  await deployer.deploy(SensorRegistry, dGateKeeper.address, dDtxToken.address)
  dTokenCuratedRegistry = await SensorRegistry.deployed()

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

  // Set normal user permissions on all the users.
  await setUserPermissions(accounts, 0)
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
