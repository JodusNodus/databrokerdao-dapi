/* eslint-env mocha */
/* global assert contract artifacts */

const testEvent = require('@settlemint/solidity-mint/test/helpers/testEvent')
const getEventProperty = require('../helpers/getEventProperty')

const StreamRegistry = artifacts.require('StreamRegistry.sol')
const Token = artifacts.require('DtxToken.sol')
const Stream = artifacts.require('Stream.sol')

contract('StreamRegistry', accounts => {
  describe('Function: approveChallenge', async () => {
    const [seller] = accounts

    it('should approve the challenge and refund the stakes to the right addresses', async () => {
      const registry = await StreamRegistry.deployed()
      const token = await Token.deployed()

      // Enlist before we can challenge
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
      await registry.challenge(listingAddress, '5') // challenge 1
      await token.approve(registry.address, '10', {
        from: seller,
      })
      await registry.challenge(listingAddress, '10') // challenge 2

      // Approve
      await token.approve(registry.address, '10', {
        from: seller,
      })
      const tx2 = await registry.approveChallenge(listingAddress, {
        from: seller,
      })

      // Check if event was emitted
      testEvent(tx2, 'ChallengeApproved', {
        listing: listingAddress,
      })

      // Check if listing is updated
      const stream = await Stream.at(listingAddress)
      const streamChallenges = await stream.challenges.call()
      const streamStake = await stream.stake.call()
      const streamChallengesStake = await stream.challengesStake.call()

      assert.equal(streamChallenges.c[0], 0)
      assert.equal(streamStake.c[0], 0)
      assert.equal(streamChallengesStake.c[0], 0)

      // Check if challenge is updated
      const challenge = await registry.challenges.call('1')
      assert.isTrue(challenge[1])
    })
  })
})
