/* eslint-env mocha */
/* global assert contract artifacts */

const testEvent = require('@settlemint/solidity-mint/test/helpers/testEvent')

const Registry = artifacts.require('Registry.sol')
const Token = artifacts.require('DtxToken.sol')

contract('Registry', accounts => {
  describe('Function: approveChallenge', async () => {
    const [seller] = accounts

    it('should approve the challenge and refund the stakes to the right addresses', async () => {
      const registry = await Registry.deployed()
      const token = await Token.deployed()

      // Enlist before we can unlist
      await token.approve(seller, '10', {
        from: seller,
      })
      await registry.enlist('6', '10', 'blablabla')

      // Add some challenges
      await token.approve(seller, '5', {
        from: seller,
      })
      await registry.challenge('6', '5')
      await token.approve(seller, '10', {
        from: seller,
      })
      await registry.challenge('6', '10')

      await token.approve(seller, '10', {
        from: seller,
      })
      const tx = await registry.approveChallenge('6')

      // Check if event was emitted
      testEvent(tx, 'ChallengeApproved', {
        listing:
          '0x6000000000000000000000000000000000000000000000000000000000000000',
      })

      // Check if listing is updated
      const listing = await registry.listings.call(
        '0x6000000000000000000000000000000000000000000000000000000000000000'
      )
      assert.isFalse(listing[0])
      assert.equal(listing[2].c[0], 0)
      assert.equal(listing[5].c[0], 0)

      // Check if challenge is updated
      const challenge = await registry.challenges.call('2')
      assert.isTrue(challenge[1])
    })
  })
})
