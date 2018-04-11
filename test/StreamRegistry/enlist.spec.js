/* eslint-env mocha */
/* global assert contract artifacts */

const testEvent = require('@settlemint/solidity-mint/test/helpers/testEvent')
const getEventProperty = require('../helpers/getEventProperty')

const SensorRegistry = artifacts.require('SensorRegistry.sol')
const Token = artifacts.require('DtxToken.sol')
const Sensor = artifacts.require('Sensor.sol')

contract('SensorRegistry', accounts => {
  describe('Function: enlist', async () => {
    const [seller] = accounts

    it('should allow a seller to enlist sensor data when stake is high enough', async () => {
      const registry = await SensorRegistry.deployed()
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

      const sensor = await Sensor.at(listingAddress)
      const sensorOwner = await sensor.owner.call()
      const sensorStake = await sensor.stake.call()
      const sensorChallengesStake = await sensor.challengesStake.call()
      const sensorPrice = await sensor.price.call()

      assert.equal(sensorOwner, seller)
      assert.equal(sensorStake, '10')
      assert.equal(sensorChallengesStake, '0')
      assert.equal(sensorPrice, '1')
    })

    it('should not allow a seller to enlist sensor data when stake is not high enough', async () => {
      const registry = await SensorRegistry.deployed()
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
