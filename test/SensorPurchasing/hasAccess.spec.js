/* eslint-env mocha */
/* global assert contract artifacts */

const testEvent = require('@settlemint/solidity-mint/test/helpers/testEvent')

const StreamPurchasing = artifacts.require('StreamPurchasing.sol')
const StreamRegistry = artifacts.require('StreamRegistry.sol')
const Token = artifacts.require('DtxToken.sol')

contract('StreamPurchasing', accounts => {
  describe('Function: hasAccess', async () => {
    const [seller] = accounts

    it('should return false when user has no access', async () => {
      const purchasing = await StreamPurchasing.deployed()
      const registry = await StreamRegistry.deployed()
      const token = await Token.deployed()

      // Enlist first
      await token.approve(seller, '10', {
        from: seller,
      })
      await registry.enlist('1', '10', '1', {
        from: seller,
      })

      // Then check access
      const res = await purchasing.hasAccess.call('1')
      assert.isFalse(res)
    })

    it('should return true when user has access', async () => {
      const purchasing = await StreamPurchasing.deployed()
      const registry = await StreamRegistry.deployed()
      const token = await Token.deployed()

      // Enlist first
      await token.approve(seller, '10', {
        from: seller,
      })
      await registry.enlist('1', '10', '1', {
        from: seller,
      })

      // Then purchase
      await token.approve(purchasing.address, '100', {
        from: seller,
      })
      await purchasing.purchaseAccess('1', new Date().getTime() / 1000 + 60, {
        from: seller,
      })

      // Then check access
      const res = await purchasing.hasAccess.call('1')
      assert.isTrue(res)
    })
  })
})
