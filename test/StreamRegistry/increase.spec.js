/* eslint-env mocha */
/* global assert contract artifacts */

const testEvent = require('@settlemint/solidity-mint/test/helpers/testEvent')
const getEventProperty = require('../helpers/getEventProperty')

const SensorRegistry = artifacts.require('SensorRegistry.sol')
const Token = artifacts.require('DtxToken.sol')
const Sensor = artifacts.require('Sensor.sol')

contract('SensorRegistry', accounts => {
  describe('Function: increase', async () => {
    const [seller] = accounts

    it('should increase the stake for the listing', async () => {
      const registry = await SensorRegistry.deployed()
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

      const sensor = await Sensor.at(listingAddress)
      const sensorStake = await sensor.stake.call()

      assert.equal(sensorStake, '20')
    })
  })
})
