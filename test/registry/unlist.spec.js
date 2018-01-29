/* eslint-env mocha */
/* global assert contract artifacts */

const testEvent = require('@settlemint/solidity-mint/test/helpers/testEvent')

const Registry = artifacts.require('Registry.sol')
const Token = artifacts.require('DtxToken.sol')

contract('Registry', accounts => {
  describe('Function: unlist', async () => {
    const [seller] = accounts

    it('should remove the sensor data from the whitelist', async () => {
      const registry = await Registry.deployed()
      const token = await Token.deployed()

      // Enlist before we can unlist
      await token.approve(seller, '10', {
        from: seller,
      })
      await registry.enlist('2', '10', 'blablabla', {
        from: seller,
      })

      await token.approve(Registry.address, '10', {
        from: seller,
      })
      const tx = await registry.unlist('2', {
        from: seller,
      })

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
