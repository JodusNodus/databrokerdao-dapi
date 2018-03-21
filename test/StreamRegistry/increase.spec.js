/* eslint-env mocha */
/* global assert contract artifacts */

const testEvent = require('@settlemint/solidity-mint/test/helpers/testEvent')
const getEventProperty = require('../helpers/getEventProperty')

const StreamRegistry = artifacts.require('StreamRegistry.sol')
const Token = artifacts.require('DtxToken.sol')
const Stream = artifacts.require('Stream.sol')

contract('StreamRegistry', accounts => {
  describe('Function: increase', async () => {
    const [seller] = accounts

    it('should increase the stake for the listing', async () => {
      const registry = await StreamRegistry.deployed()
      const token = await Token.deployed()

      // Enlist before we can unlist
      await token.approve(registry.address, '10', {
        from: seller,
      })
      const tx = await registry.enlist('10', '10', '', {
        from: seller,
      })
      const listingAddress = getEventProperty(tx, 'Enlisted', 'listing')

      await token.approve(registry.address, '10', {
        from: seller,
      })
      const tx2 = await registry.increase(listingAddress, '10')

      // Check if event was emitted
      testEvent(tx2, 'Increased', {
        listing: listingAddress,
        increasedBy: '10',
        newStake: '20',
      })

      const stream = await Stream.at(listingAddress)
      const streamStake = await stream.stake.call()

      assert.equal(streamStake, '20')
    })
  })
})
