/* eslint-env mocha */
/* global assert contract artifacts */

const testEvent = require('@settlemint/solidity-mint/test/helpers/testEvent')

const StreamRegistry = artifacts.require('StreamRegistry.sol')
const Token = artifacts.require('DtxToken.sol')

contract('StreamRegistry', accounts => {
  describe('Function: withdraw', async () => {
    const [seller] = accounts

    it('should withdraw all funds on the contract', async () => {
      const registry = await StreamRegistry.deployed()
      const token = await Token.deployed()

      // Enlist before we can unlist
      await token.approve(seller, '10', {
        from: seller,
      })
      await registry.enlist('10', '10')

      const tx = await registry.withdraw({
        from: seller,
      })

      // Check if event was emitted
      testEvent(tx, 'Withdrawn', {
        by: seller,
        balance: '0',
      })
    })
  })
})
