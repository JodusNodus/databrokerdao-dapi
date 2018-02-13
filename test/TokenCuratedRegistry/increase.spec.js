/* eslint-env mocha */
/* global assert contract artifacts */

const testEvent = require('@settlemint/solidity-mint/test/helpers/testEvent')

const SensorRegistry = artifacts.require('SensorRegistry.sol')
const Token = artifacts.require('DtxToken.sol')

contract('SensorRegistry', accounts => {
  describe('Function: increase', async () => {
    const [seller] = accounts

    it('should increase the stake for the listing', async () => {
      const registry = await SensorRegistry.deployed()
      const token = await Token.deployed()

      // Enlist before we can unlist
      await token.approve(seller, '10', {
        from: seller,
      })
      await registry.enlist('1', '10', 'blablabla')

      await token.approve(seller, '10', {
        from: seller,
      })
      const tx = await registry.increase('1', '10')

      // Check if event was emitted
      testEvent(tx, 'Increased', {
        listing:
          '0x1000000000000000000000000000000000000000000000000000000000000000',
        increasedBy: '10',
        newDeposit: '20',
      })
    })
  })
})
