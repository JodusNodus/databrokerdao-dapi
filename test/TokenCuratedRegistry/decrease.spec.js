/* eslint-env mocha */
/* global assert contract artifacts */

const testEvent = require('@settlemint/solidity-mint/test/helpers/testEvent')

const DataRegistry = artifacts.require('DataRegistry.sol')
const Token = artifacts.require('Token.sol')

contract('DataRegistry', accounts => {
  describe('Function: decrease', async () => {
    const [seller] = accounts

    it('should decrease the stake for the listing as when stake is still the minimum stake', async () => {
      const registry = await DataRegistry.deployed()
      const token = await Token.deployed()

      // Enlist before we can unlist
      await token.approve(seller, '10', {
        from: seller,
      })
      await registry.enlist('1', '20', 'blablabla')

      await token.approve(seller, '10', {
        from: seller,
      })
      const tx = await registry.decrease('1', '10')

      // Check if event was emitted
      testEvent(tx, 'Decreased', {
        listing:
          '0x1000000000000000000000000000000000000000000000000000000000000000',
        decreasedBy: '10',
        newDeposit: '10',
      })
    })

    it('should not decrease when stake amount would go beneath minimum stake', async () => {
      const registry = await DataRegistry.deployed()
      const token = await Token.deployed()

      // Enlist before we can unlist
      await token.approve(seller, '10', {
        from: seller,
      })
      await registry.enlist('1', '10', 'blablabla')

      try {
        assert.throws(await registry.decrease('1', '5'), 'invalid opcode')
      } catch (e) {
        console.log(e)
      }
    })
  })
})
