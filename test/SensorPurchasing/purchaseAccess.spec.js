/* eslint-env mocha */
/* global assert contract artifacts */

const testEvent = require('@settlemint/solidity-mint/test/helpers/testEvent')

const StreamPurchasing = artifacts.require('StreamPurchasing.sol')
const StreamRegistry = artifacts.require('StreamRegistry.sol')
const Token = artifacts.require('DtxToken.sol')

contract('StreamPurchasing', accounts => {
  describe('Function: purchaseAccess', async () => {
    const [seller] = accounts

    it('should allow a user to buy access to sensor data', async () => {
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
      const tx1 = await token.approve(purchasing.address, '60', {
        from: seller,
      })
      testEvent(tx1, 'Approval', {})

      const endTime = new Date().getTime() / 1000 + 60 // one minute from now
      const tx = await purchasing.purchaseAccess('1', endTime, {
        from: seller,
      })

      // Check if events have been emitted
      testEvent(tx, 'AccessPurchased', {
        listing:
          '0x1000000000000000000000000000000000000000000000000000000000000000',
      })
    })
  })
})
