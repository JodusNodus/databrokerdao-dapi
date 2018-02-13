/* eslint-env mocha */
/* global assert contract artifacts */

const testEvent = require('@settlemint/solidity-mint/test/helpers/testEvent')

const SensorRegistry = artifacts.require('SensorRegistry.sol')
const Token = artifacts.require('Token.sol')

contract('SensorRegistry', accounts => {
  describe('Function: challenge', async () => {
    const [seller] = accounts

    it('should add a new challenge when minimum challenge stake amount is exceeded', async () => {
      const registry = await SensorRegistry.deployed()
      const token = await Token.deployed()

      // Enlist before we can unlist
      await token.approve(seller, '10', {
        from: seller,
      })
      await registry.enlist('1', '10', 'blablabla')

      await token.approve(seller, '5', {
        from: seller,
      })
      const tx = await registry.challenge('1', '5')

      // Check if event was emitted
      testEvent(tx, 'Challenged', {
        listing:
          '0x1000000000000000000000000000000000000000000000000000000000000000',
        deposit: '5',
        challengeID: '1',
      })

      // Check if listing is updated
      const listing = await registry.listings.call(
        '0x1000000000000000000000000000000000000000000000000000000000000000'
      )
      assert.equal(listing[4].c[0], 1) // number of unresolved challenges
      assert.equal(listing[5].c[0], 15) // total stake, both initial and challenges

      // Check if challenge is updated
      const challenge = await registry.challenges.call('1')
      assert.equal(challenge[0].seller)
      assert.isFalse(challenge[1])
      assert.equal(
        challenge[3],
        '0x1000000000000000000000000000000000000000000000000000000000000000'
      )
    })

    it('should not add a new challenge when minimum challenge stake amount is not reached', async () => {
      const registry = await SensorRegistry.deployed()
      const token = await Token.deployed()

      // Enlist before we can unlist
      await token.approve(seller, '10', {
        from: seller,
      })
      await registry.enlist('1', '10', 'blablabla')

      try {
        assert.throws(await registry.challenge('1', '2'), 'invalid opcode')
      } catch (e) {
        console.log(e)
      }
    })
  })
})
