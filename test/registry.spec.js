/* eslint-env mocha */
/* global assert contract artifacts */

const testEvent = require('@settlemint/solidity-mint/test/helpers/testEvent')

const Registry = artifacts.require('Registry.sol')

contract('Registry', accounts => {
  describe('Function: enlist', async () => {
    const [seller] = accounts

    it('should allow a seller to enlist sensor data when stake is high enough', async () => {
      const registry = await Registry.deployed()

      const tx = await registry.enlist('1', '10', 'blablabla')

      // Check if events have been emitted
      testEvent(tx, 'Enlisted', {
        listing:
          '0x1000000000000000000000000000000000000000000000000000000000000000',
        deposit: '10',
        target: 'blablabla',
      })

      // Check if listing has all necessary props
      const listing = await registry.listings.call(
        '0x1000000000000000000000000000000000000000000000000000000000000000'
      )
      assert.isTrue(listing[0])
      assert.equal(listing[1], seller)
    })

    it('should not allow a seller to enlist sensor data when stake is not high enough', async () => {
      const registry = await Registry.deployed()

      try {
        assert.throws(
          await registry.enlist(
            '0xbb9bc244d798123fde783fcc1c72d3bb8c189413',
            '1',
            'blablabla'
          ),
          'invalid opcode'
        )
      } catch (e) {
        console.log(e)
      }
    })
  })

  describe('Function: unlist', async () => {
    const [seller] = accounts

    it('should remove the sensor data from the whitelist', async () => {
      const registry = await Registry.deployed()

      // Enlist before we can unlist
      await registry.enlist('2', '10', 'blablabla')

      const tx = await registry.unlist('2')

      // Check if event was emitted
      testEvent(tx, 'Unlisted', {
        listing:
          '0x2000000000000000000000000000000000000000000000000000000000000000',
      })

      // Check if listing is actually gone
      const listing = await registry.listings.call(
        '0x2000000000000000000000000000000000000000000000000000000000000000'
      )

      assert.isFalse(listing[0])
    })
  })
})
