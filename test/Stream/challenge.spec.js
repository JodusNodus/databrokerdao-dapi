/* eslint-env mocha */
/* global assert contract artifacts */

const testEvent = require('@settlemint/solidity-mint/test/helpers/testEvent')
const getEventProperty = require('../helpers/getEventProperty')

const StreamRegistry = artifacts.require('StreamRegistry.sol')
const Token = artifacts.require('DtxToken.sol')
const Stream = artifacts.require('Stream.sol')

contract('StreamRegistry', accounts => {
  describe('Function: challenge', async () => {
    const [seller] = accounts

    it('should add a new challenge when minimum challenge stake amount is exceeded', async () => {
      const registry = await StreamRegistry.deployed()
      const token = await Token.deployed()

      // Enlist before we can challenge
      await token.approve(seller, '10', {
        from: seller,
      })
      const tx = await registry.enlist('10', '10', '', {
        from: seller,
      })
      const listingAddress = getEventProperty(tx, 'Enlisted', 'listing')

      await token.approve(seller, '5', {
        from: seller,
      })
      const tx2 = await registry.challenge(listingAddress, '5')

      // Check if event was emitted
      testEvent(tx2, 'Challenged', {
        listing: listingAddress,
        stake: '5',
        challengeID: '1',
      })

      // Check if listing is updated
      const stream = await Stream.at(listingAddress)
      const streamChallenges = await stream.challenges.call()
      const streamChallengesStake = await stream.challengesStake.call()

      assert.equal(streamChallenges, 1)
      assert.equal(streamChallengesStake, 5)

      // Check if challenge is updated
      const challenge = await registry.challenges.call('1')
      assert.equal(challenge[0].seller)
      assert.isFalse(challenge[1])
      assert.equal(challenge[3], listingAddress)
    })

    it('should not add a new challenge when minimum challenge stake amount is not reached', async () => {
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

      try {
        assert.throws(
          await registry.challenge(listingAddress, '2'),
          'invalid opcode'
        )
      } catch (e) {
        console.log(e)
      }
    })
  })
})
