/* eslint-env mocha */
/* global assert contract artifacts */

const testEvent = require('@settlemint/solidity-mint/test/helpers/testEvent')

const Registry = artifacts.require('Registry.sol')
const Token = artifacts.require('DtxToken.sol')

contract('Registry', accounts => {
  describe('Function: denyChallenge', async () => {
    const [seller] = accounts

    it('should deny the challenge and refund the stakes to the right addresses', async () => {
      const registry = await Registry.deployed()
      const token = await Token.deployed()

      // Enlist before we can unlist
      await token.approve(seller, '10', {
        from: seller,
      })
      await registry.enlist('7', '10', 'blablabla')

      // Add some challenges
      await token.approve(seller, '5', {
        from: seller,
      })
      await registry.challenge('7', '5')
      await token.approve(seller, '10', {
        from: seller,
      })
      await registry.challenge('7', '10')

      await token.approve(seller, '10', {
        from: seller,
      })
      const tx = await registry.denyChallenge('7')

      // Check if event was emitted
      testEvent(tx, 'ChallengeDenied', {
        listing:
          '0x7000000000000000000000000000000000000000000000000000000000000000',
      })

      // Check if listing is updated
      const listing = await registry.listings.call(
        '0x7000000000000000000000000000000000000000000000000000000000000000'
      )
      assert.isTrue(listing[0])
      assert.equal(listing[4].c[0], 0)

      // Check if challenge is updated
      const challenge = await registry.challenges.call('4')
      assert.isTrue(challenge[1])
    })
  })
})
