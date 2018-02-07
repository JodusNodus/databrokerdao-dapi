/* eslint-env mocha */
/* global assert contract artifacts */

const testEvent = require('@settlemint/solidity-mint/test/helpers/testEvent')

const DataRegistry = artifacts.require('DataRegistry.sol')
const Token = artifacts.require('DtxToken.sol')

contract('DataRegistry', accounts => {
  describe('Function: enlist', async () => {
    const [seller] = accounts

    it('should allow a seller to enlist sensor data when stake is high enough', async () => {
      const registry = await DataRegistry.deployed()
      const token = await Token.deployed()

      await token.approve(seller, '10', {
        from: seller,
      })

      const tx = await registry.enlist('1', '10', 'blablabla', {
        from: seller,
      })

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
      assert.equal(listing[5].c[0], 10)
    })

    it('should not allow a seller to enlist sensor data when stake is not high enough', async () => {
      const registry = await TokenCuratedRegistry.deployed()
      const token = await Token.deployed()

      // Enlist before we can unlist
      await token.approve(seller, '10', {
        from: seller,
      })

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
})
