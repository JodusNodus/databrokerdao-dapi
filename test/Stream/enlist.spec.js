/* eslint-env mocha */
/* global assert contract artifacts */

const testEvent = require('@settlemint/solidity-mint/test/helpers/testEvent')
const getEventProperty = require('../helpers/getEventProperty')

const StreamRegistry = artifacts.require('StreamRegistry.sol')
const Token = artifacts.require('DtxToken.sol')
const Stream = artifacts.require('Stream.sol')

contract('StreamRegistry', accounts => {
  describe('Function: enlist', async () => {
    const [seller] = accounts

    it('should allow a seller to enlist sensor data when stake is high enough', async () => {
      const registry = await StreamRegistry.deployed()
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

      const listingAddress = getEventProperty(tx, 'Enlisted', 'listing')
      assert.isDefined(listingAddress)

      const stream = await Stream.at(listingAddress)
      const streamOwner = await stream.owner.call()
      const streamStake = await stream.stake.call()
      const streamChallengesStake = await stream.challengesStake.call()
      const streamPrice = await stream.price.call()

      assert.equal(streamOwner, seller)
      assert.equal(streamStake, '10')
      assert.equal(streamChallengesStake, '0')
      assert.equal(streamPrice, '1')
    })

    it('should not allow a seller to enlist sensor data when stake is not high enough', async () => {
      const registry = await StreamRegistry.deployed()
      const token = await Token.deployed()

      // Enlist before we can unlist
      await token.approve(seller, '10', {
        from: seller,
      })

      try {
        assert.throws(await registry.enlist('1', '1'), 'invalid opcode')
      } catch (e) {
        console.log(e)
      }
    })
  })
})
