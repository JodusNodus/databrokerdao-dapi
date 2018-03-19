/* eslint-env mocha */
/* global assert contract artifacts */

const testEvent = require('@settlemint/solidity-mint/test/helpers/testEvent')
const getEventProperty = require('../helpers/getEventProperty')

const Minter = artifacts.require('DtxMinter.sol')

contract('DtxMinter', accounts => {
  describe('Function: mint', async () => {
    const [seller] = accounts

    it('should allow a user to mint tokens for himself', async () => {
      const minter = await Minter.deployed()

      const tx = await minter.mint('1000', {
        from: seller,
      })

      // Check if events have been emitted
      testEvent(tx, 'Minted', {
        amount: '1000',
        to: seller,
      })
    })
  })
})
