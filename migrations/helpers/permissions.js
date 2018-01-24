async function createPermission(
  gateKeeper,
  manager,
  contract,
  permissionName,
  recipient
) {
  const role = await contract[permissionName].call()
  await gateKeeper.createPermission(recipient, contract.address, role, manager)
}

async function grantPermission(
  gateKeeper,
  contract,
  permissionName,
  recipient
) {
  const role = await contract[permissionName].call()
  await gateKeeper.grantPermission(recipient, contract.address, role)
}

module.exports = {
  createPermission,
  grantPermission,
}
