/* eslint-env mocha */
/* global assert contract artifacts */

const testEvent = require('@settlemint/solidity-mint/test/helpers/testEvent')
const getEventProperty = require('../helpers/getEventProperty')

const SensorRegistry = artifacts.require('SensorRegistry.sol')
const SensorRegistryDispatcher = artifacts.require(
  'SensorRegistryDispatcher.sol'
)
const Token = artifacts.require('DtxToken.sol')

contract('SensorRegistry', accounts => {
  describe.only('Function: enlist', async () => {
    const [seller] = accounts

    it('is upgradeable', async () => {
      const registryDispatcher = await SensorRegistryDispatcher.deployed()
      const registryAddress = await registryDispatcher.target.call()
      const registry = SensorRegistry.at(registryAddress)
      const token = await Token.deployed()

      await token.approve(registry.address, '10', {
        from: seller,
      })
      const tx = await registry.enlist('10', '1', '', {
        from: seller,
      })

      // Check if events have been emitted
      testEvent(tx, 'Enlisted', {
        stake: '10',
        price: '1',
      })
    })
  })
})
