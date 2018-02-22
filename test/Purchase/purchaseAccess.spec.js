/* eslint-env mocha */
/* global assert contract artifacts */

const testEvent = require('@settlemint/solidity-mint/test/helpers/testEvent')
const getEventProperty = require('../helpers/getEventProperty')

const PurchaseRegistry = artifacts.require('PurchaseRegistry.sol')
const StreamRegistry = artifacts.require('StreamRegistry.sol')
const Token = artifacts.require('DtxToken.sol')
const Purchase = artifacts.require('Purchase.sol')
const Stream = artifacts.require('Stream.sol')

contract('PurchaseRegistry', accounts => {
  describe('Function: purchaseAccess', async () => {
    const [seller] = accounts

    it('should allow a user to buy access to sensor data', async () => {
      const purchasing = await PurchaseRegistry.deployed()
      const registry = await StreamRegistry.deployed()
      const token = await Token.deployed()

      // Enlist first
      await token.approve(seller, '10', {
        from: seller,
      })
      const tx = await registry.enlist('10', '1', {
        from: seller,
      })
      const listingAddress = getEventProperty(tx, 'Enlisted', 'listing')

      // Then purchase
      await token.approve(purchasing.address, '100', {
        from: seller,
      })
      const endTime = new Date().getTime() / 1000 + 60 // one minute from now
      const tx2 = await purchasing.purchaseAccess(listingAddress, endTime, {
        from: seller,
      })

      // Check if events have been emitted
      testEvent(tx2, 'AccessPurchased', {
        stream: listingAddress,
      })
      const purchaseAddress = getEventProperty(
        tx2,
        'AccessPurchased',
        'purchase'
      )

      const purchase = await Purchase.at(purchaseAddress)
      const purchasePurchaser = await purchase.purchaser.call()
      const purchaseStream = await purchase.stream.call()

      assert.equal(purchasePurchaser, seller)
      assert.equal(purchaseStream, listingAddress)

      const stream = await Stream.at(listingAddress)
      const streamPurchase = await stream.purchases.call(seller)

      assert.isDefined(streamPurchase)
    })
  })
})
