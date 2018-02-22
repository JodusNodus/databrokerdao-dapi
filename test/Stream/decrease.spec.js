/* eslint-env mocha */
/* global assert contract artifacts */

const testEvent = require('@settlemint/solidity-mint/test/helpers/testEvent')
const getEventProperty = require('../helpers/getEventProperty')

const StreamRegistry = artifacts.require('StreamRegistry.sol')
const Token = artifacts.require('DtxToken.sol')
const Stream = artifacts.require('Stream.sol')

contract('StreamRegistry', accounts => {
  describe('Function: decrease', async () => {
    const [seller] = accounts

    it('should decrease the stake for the listing as when stake is still the minimum stake', async () => {
      const registry = await StreamRegistry.deployed()
      const token = await Token.deployed()

      // Enlist before we can decrease
      await token.approve(seller, '10', {
        from: seller,
      })
      const tx = await registry.enlist('20', '10', {
        from: seller,
      })
      const listingAddress = getEventProperty(tx, 'Enlisted', 'listing')

      await token.approve(seller, '10', {
        from: seller,
      })
      const tx2 = await registry.decrease(listingAddress, '5')

      // Check if event was emitted
      testEvent(tx2, 'Decreased', {
        listing: listingAddress,
        decreasedBy: '5',
        newStake: '15',
      })

      const stream = await Stream.at(listingAddress)
      const streamStake = await stream.stake.call()

      assert.equal(streamStake, '15')
    })

    it('should not decrease when stake amount would go beneath minimum stake', async () => {
      const registry = await StreamRegistry.deployed()
      const token = await Token.deployed()

      // Enlist before we can decrease
      await token.approve(seller, '10', {
        from: seller,
      })
      const tx = await registry.enlist('10', '10', {
        from: seller,
      })
      const listingAddress = getEventProperty(tx, 'Enlisted', 'listing')

      try {
        assert.throws(
          await registry.decrease(listingAddress, '5'),
          'invalid opcode'
        )
      } catch (e) {
        console.log(e)
      }
    })
  })
})
