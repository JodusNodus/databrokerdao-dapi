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

  describe('Function: increase', async () => {
    const [seller] = accounts

    it('should increase the stake for the listing', async () => {
      const registry = await Registry.deployed()

      // Enlist before we can unlist
      await registry.enlist('3', '10', 'blablabla')

      const tx = await registry.increase('3', '10')

      // Check if event was emitted
      testEvent(tx, 'Increased', {
        listing:
          '0x3000000000000000000000000000000000000000000000000000000000000000',
        increasedBy: '10',
        newDeposit: '20',
      })
    })
  })

  describe('Function: decrease', async () => {
    const [seller] = accounts

    it('should decrease the stake for the listing as when stake is still the minimum stake', async () => {
      const registry = await Registry.deployed()

      // Enlist before we can unlist
      await registry.enlist('4', '20', 'blablabla')

      const tx = await registry.decrease('4', '10')

      // Check if event was emitted
      testEvent(tx, 'Decreased', {
        listing:
          '0x4000000000000000000000000000000000000000000000000000000000000000',
        decreasedBy: '10',
        newDeposit: '10',
      })
    })

    it('should not decrease when stake amount would go beneath minimum stake', async () => {
      const registry = await Registry.deployed()

      // Enlist before we can unlist
      await registry.enlist('4', '10', 'blablabla')

      try {
        assert.throws(await registry.decrease('4', '5'), 'invalid opcode')
      } catch (e) {
        console.log(e)
      }
    })
  })

  describe('Function: challenge', async () => {
    const [seller] = accounts

    it('should add a new challenge when minimum challenge stake amount is exceeded', async () => {
      const registry = await Registry.deployed()

      // Enlist before we can unlist
      await registry.enlist('5', '10', 'blablabla')

      const tx = await registry.challenge('5', '5')

      // Check if event was emitted
      testEvent(tx, 'Challenged', {
        listing:
          '0x5000000000000000000000000000000000000000000000000000000000000000',
        deposit: '5',
        challengeID: '1',
      })

      // Check if listing is updated
      const listing = await registry.listings.call(
        '0x5000000000000000000000000000000000000000000000000000000000000000'
      )
      assert.equal(listing[4].c[0], 1)

      // Check if challenge is updated
      const challenge = await registry.challenges.call('1')
      assert.equal(challenge[0].seller)
      assert.isFalse(challenge[1])
      assert.equal(
        challenge[3],
        '0x5000000000000000000000000000000000000000000000000000000000000000'
      )
    })

    it('should not add a new challenge when minimum challenge stake amount is not reached', async () => {
      const registry = await Registry.deployed()

      // Enlist before we can unlist
      await registry.enlist('6', '10', 'blablabla')

      try {
        assert.throws(await registry.challenge('6', '2'), 'invalid opcode')
      } catch (e) {
        console.log(e)
      }
    })
  })

  describe('Function: approveChallenge', async () => {
    const [seller] = accounts

    it('should approve the challenge and refund the stakes to the right addresses', async () => {
      const registry = await Registry.deployed()

      // Enlist before we can unlist
      await registry.enlist('6', '10', 'blablabla')
      // Add some challenges
      await registry.challenge('6', '5')
      await registry.challenge('6', '7')

      const tx = await registry.approveChallenge('6')
      console.log(tx)

      // Check if event was emitted
      testEvent(tx, 'ChallengeApproved', {
        listing:
          '0x6000000000000000000000000000000000000000000000000000000000000000',
      })

      // Check if listing is updated
      const listing = await registry.listings.call(
        '0x6000000000000000000000000000000000000000000000000000000000000000'
      )
      console.log(listing)
    })

    it('should not add a new challenge when minimum challenge stake amount is not reached', async () => {
      const registry = await Registry.deployed()

      // Enlist before we can unlist
      await registry.enlist('6', '10', 'blablabla')

      try {
        assert.throws(await registry.challenge('6', '2'), 'invalid opcode')
      } catch (e) {
        console.log(e)
      }
    })
  })
})
