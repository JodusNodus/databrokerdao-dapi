/* eslint-env mocha */
/* global assert contract artifacts */

const testEvent = require('@settlemint/solidity-mint/test/helpers/testEvent')

const Registry = artifacts.require('Registry.sol')

contract('Registry', accounts => {
  describe('Function: enlist', async () => {
    const [seller] = accounts

    it('should allow a seller to enlist sensor data when stake is high enough', async () => {
      const registry = await Registry.deployed()

      const tx = await registry.enlist(
        '0x0000000000000000000000000000000000000000',
        '10',
        'blablabla'
      )

      // Check if event has occurred
      testEvent(tx, 'Enlisted', {
        listing:
          '0x0000000000000000000000000000000000000000000000000000000000000000',
        deposit: '10',
        target: 'blablabla',
      })

      // Check if listing has all necessary props
      const listing = await registry.listings.call(
        '0x0000000000000000000000000000000000000000000000000000000000000000'
      )
      assert.isTrue(listing[0])
      assert.equal(listing[1], seller)
    })

    it('should not allow a seller to enlist sensor data when stake is not high enough', async () => {
      const registry = await Registry.deployed()

      try {
        assert.throws(
          await registry.enlist(
            '0x0000000000000000000000000000000000000000',
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
})
