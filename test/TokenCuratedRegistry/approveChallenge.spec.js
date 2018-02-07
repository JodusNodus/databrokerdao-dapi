/* eslint-env mocha */
/* global assert contract artifacts */

const testEvent = require('@settlemint/solidity-mint/test/helpers/testEvent')

const DataRegistry = artifacts.require('DataRegistry.sol')
const Token = artifacts.require('DtxToken.sol')

contract('DataRegistry', accounts => {
  describe('Function: approveChallenge', async () => {
    const [seller] = accounts

    it('should approve the challenge and refund the stakes to the right addresses', async () => {
      const registry = await DataRegistry.deployed()
      const token = await Token.deployed()

      // Enlist before we can unlist
      await token.approve(seller, '10', {
        from: seller,
      })
      await registry.enlist('1', '10', 'blablabla')

      // Add some challenges
      await token.approve(seller, '5', {
        from: seller,
      })
      await registry.challenge('1', '5')
      await token.approve(seller, '10', {
        from: seller,
      })
      await registry.challenge('1', '10')

      await token.approve(seller, '10', {
        from: seller,
      })
      const tx = await registry.approveChallenge('1')

      // Check if event was emitted
      testEvent(tx, 'ChallengeApproved', {
        listing:
          '0x1000000000000000000000000000000000000000000000000000000000000000',
      })

      // Check if listing is updated
      const listing = await registry.listings.call(
        '0x1000000000000000000000000000000000000000000000000000000000000000'
      )
      assert.isFalse(listing[0])
      assert.equal(listing[2].c[0], 0)
      assert.equal(listing[5].c[0], 0)

      // Check if challenge is updated
      const challenge = await registry.challenges.call('1')
      assert.isTrue(challenge[1])
    })
  })
})
