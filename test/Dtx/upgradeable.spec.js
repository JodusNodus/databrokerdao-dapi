/* eslint-env mocha */
/* global assert contract artifacts */

const testEvent = require('@settlemint/solidity-mint/test/helpers/testEvent')

const Minter = artifacts.require('DtxMinter.sol')
const MinterDispatcher = artifacts.require('DtxMinterDispatcher.sol')

contract('DtxMinter', accounts => {
  it('is Upgradeable', async () => {
    const [seller] = accounts

    const minterDispatcher = await MinterDispatcher.deployed()
    const minter = Minter.at(minterDispatcher.address)

    const token = await minter.token.call()
    console.log('---', token)

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
