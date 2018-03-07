/* eslint-env mocha */
/* global assert contract artifacts */

const testEvent = require('@settlemint/solidity-mint/test/helpers/testEvent')
const getEventProperty = require('../helpers/getEventProperty')

const StreamRegistry = artifacts.require('StreamRegistry.sol')
const Token = artifacts.require('DtxToken.sol')
const Stream = artifacts.require('Stream.sol')

contract('StreamRegistry', accounts => {
  describe('Function: unlist', async () => {
    const [seller] = accounts

    it('should remove the sensor data from the whitelist', async () => {
      const registry = await StreamRegistry.deployed()
      const token = await Token.deployed()

      // Enlist before we can unlist
      await token.approve(seller, '10', {
        from: seller,
      })
      const tx = await registry.enlist('10', '10', '', {
        from: seller,
      })
      const listingAddress = getEventProperty(tx, 'Enlisted', 'listing')

      await token.approve(StreamRegistry.address, '10', {
        from: seller,
      })
      const tx2 = await registry.unlist(listingAddress, {
        from: seller,
      })

      // Check if event was emitted
      testEvent(tx2, 'Unlisted', {
        listing: listingAddress,
      })

      const stream = await Stream.at(listingAddress)
      const streamWhitelisted = await stream.whitelisted.call()

      assert.isFalse(streamWhitelisted)
    })
  })
})
