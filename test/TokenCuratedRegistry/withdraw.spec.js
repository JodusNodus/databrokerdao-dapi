/* eslint-env mocha */
/* global assert contract artifacts */

const testEvent = require('@settlemint/solidity-mint/test/helpers/testEvent')

const DataRegistry = artifacts.require('DataRegistry.sol')
const Token = artifacts.require('DtxToken.sol')

contract('DataRegistry', accounts => {
  describe('Function: withdraw', async () => {
    const [seller] = accounts

    it('should withdraw all funds on the contract', async () => {
      const registry = await DataRegistry.deployed()
      const token = await Token.deployed()

      // Enlist before we can unlist
      await token.approve(seller, '10', {
        from: seller,
      })
      await registry.enlist('1', '10', 'blablabla')

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
