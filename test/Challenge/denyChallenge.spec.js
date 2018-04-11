/* eslint-env mocha */
/* global assert contract artifacts */

const testEvent = require('@settlemint/solidity-mint/test/helpers/testEvent')
const getEventProperty = require('../helpers/getEventProperty')

const StreamRegistry = artifacts.require('StreamRegistry.sol')
const Token = artifacts.require('DtxToken.sol')
const Stream = artifacts.require('Stream.sol')

contract('StreamRegistry', accounts => {
  describe('Function: denyChallenge', async () => {
    const [seller] = accounts

    it('should deny the challenge and refund the stakes to the right addresses', async () => {
      const registry = await StreamRegistry.deployed()
      const token = await Token.deployed()

      // Enlist before we can unlist
      await token.approve(registry.address, '20', {
        from: seller,
      })
      const tx = await registry.enlist('20', '10', '', {
        from: seller,
      })
      const listingAddress = getEventProperty(tx, 'Enlisted', 'listing')

      // Add some challenges
      await token.approve(registry.address, '5', {
        from: seller,
      })
      await registry.challenge(listingAddress, '5', '') // challenge 1
      await token.approve(registry.address, '10', {
        from: seller,
      })
      await registry.challenge(listingAddress, '10', '') // challenge 2

      // Deny
      // No need to approve: we are transfering tokens from the contract itself
      const tx2 = await registry.denyChallenge(listingAddress, {
        from: seller,
      })

      // Check if event was emitted
      testEvent(tx2, 'ChallengeDenied', {
        listing: listingAddress,
      })

      // Check if listing is updated
      const stream = await Stream.at(listingAddress)
      const streamStake = await stream.stake.call()
      const streamChallengesStake = await stream.challengesStake.call()

      assert.equal(streamStake.c[0], 20)
      assert.equal(streamChallengesStake.c[0], 0)
    })
  })
})
