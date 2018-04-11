/* eslint-env mocha */
/* global assert contract artifacts */

const testEvent = require('@settlemint/solidity-mint/test/helpers/testEvent')
const getEventProperty = require('../helpers/getEventProperty')

const SensorRegistry = artifacts.require('SensorRegistry.sol')
const Token = artifacts.require('DtxToken.sol')
const Sensor = artifacts.require('Sensor.sol')
const Challenge = artifacts.require('Challenge.sol')

contract('SensorRegistry', accounts => {
  describe('Function: challenge', async () => {
    const [seller] = accounts

    it('should add a new challenge when minimum challenge stake amount is exceeded', async () => {
      const registry = await SensorRegistry.deployed()
      const token = await Token.deployed()

      // Enlist before we can challenge
      await token.approve(registry.address, '20', {
        from: seller,
      })
      const tx = await registry.enlist('20', '10', '', {
        from: seller,
      })
      const listingAddress = getEventProperty(tx, 'Enlisted', 'listing')

      await token.approve(registry.address, '5', {
        from: seller,
      })
      const tx2 = await registry.challenge(listingAddress, '5', '', {
        from: seller,
      })

      // Check if event was emitted
      testEvent(tx2, 'Challenged', {
        listing: listingAddress,
        stake: '5',
      })

      // Check if listing is updated
      const sensor = await Sensor.at(listingAddress)
      const sensorChallengesStake = await sensor.challengesStake.call()

      assert.equal(sensorChallengesStake, 5)

      const challengeAddress = getEventProperty(tx2, 'Challenged', 'challenge')

      // Check if challenge is updated
      const challenge = await Challenge.at(challengeAddress)
      const challengeChallenger = await challenge.challenger.call()
      const challengeListing = await challenge.listing.call()

      assert.equal(challengeChallenger, seller)
      assert.equal(challengeListing, listingAddress)
    })

    it('should not add a new challenge when minimum challenge stake amount is not reached', async () => {
      const registry = await SensorRegistry.deployed()
      const token = await Token.deployed()

      // Enlist before we can unlist
      await token.approve(registry.address, '20', {
        from: seller,
      })
      const tx = await registry.enlist('20', '10', '', {
        from: seller,
      })
      const listingAddress = getEventProperty(tx, 'Enlisted', 'listing')

      try {
        assert.throws(
          await registry.challenge(listingAddress, '2', ''),
          'revert'
        )
      } catch (e) {
        console.log(e)
      }
    })
  })
})
