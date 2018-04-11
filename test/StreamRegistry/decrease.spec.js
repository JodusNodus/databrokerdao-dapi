/* eslint-env mocha */
/* global assert contract artifacts */

const testEvent = require('@settlemint/solidity-mint/test/helpers/testEvent')
const getEventProperty = require('../helpers/getEventProperty')

const SensorRegistry = artifacts.require('SensorRegistry.sol')
const Token = artifacts.require('DtxToken.sol')
const Sensor = artifacts.require('Sensor.sol')

contract('SensorRegistry', accounts => {
  describe('Function: decrease', async () => {
    const [seller] = accounts

    it('should decrease the stake for the listing as when stake is still the minimum stake', async () => {
      const registry = await SensorRegistry.deployed()
      const token = await Token.deployed()

      // Enlist before we can decrease
      await token.approve(registry.address, '20', {
        from: seller,
      })
      const tx = await registry.enlist('20', '10', '', {
        from: seller,
      })
      const listingAddress = getEventProperty(tx, 'Enlisted', 'listing')

      await token.approve(seller, '10', {
        from: seller,
      })
      const tx2 = await registry.decrease(listingAddress, '5', {
        from: seller,
      })

      // Check if event was emitted
      testEvent(tx2, 'Decreased', {
        listing: listingAddress,
        decreasedBy: '5',
        newStake: '15',
      })

      const sensor = await Sensor.at(listingAddress)
      const sensorStake = await sensor.stake.call()

      assert.equal(sensorStake, '15')
    })

    it('should not decrease when stake amount would go beneath minimum stake', async () => {
      const registry = await SensorRegistry.deployed()
      const token = await Token.deployed()

      // Enlist before we can decrease
      await token.approve(registry.address, '10', {
        from: seller,
      })
      const tx = await registry.enlist('10', '10', '', {
        from: seller,
      })
      const listingAddress = getEventProperty(tx, 'Enlisted', 'listing')

      try {
        assert.throws(await registry.decrease(listingAddress, '5'), 'revert')
      } catch (e) {
        console.log(e)
      }
    })
  })
})
