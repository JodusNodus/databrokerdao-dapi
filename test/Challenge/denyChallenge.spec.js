/* eslint-env mocha */
/* global assert contract artifacts */

const testEvent = require('@settlemint/solidity-mint/test/helpers/testEvent')
const getEventProperty = require('../helpers/getEventProperty')

const SensorRegistry = artifacts.require('SensorRegistry.sol')
const Token = artifacts.require('DtxToken.sol')
const Sensor = artifacts.require('Sensor.sol')

contract('SensorRegistry', accounts => {
  describe('Function: denyChallenge', async () => {
    const [seller] = accounts

    it('should deny the challenge and refund the stakes to the right addresses', async () => {
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
      const sensor = await Sensor.at(listingAddress)
      const sensorStake = await sensor.stake.call()
      const sensorChallengesStake = await sensor.challengesStake.call()

      assert.equal(sensorStake.c[0], 20)
      assert.equal(sensorChallengesStake.c[0], 0)
    })
  })
})
