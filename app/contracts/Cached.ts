/* GENERATED BY TYPECHAIN VER. 0.1.4 */
/* tslint:disable */

import { BigNumber } from 'bignumber.js'
import {
  TypeChainContract,
  promisify,
  ITxParams,
  IPayableTxParams,
  DeferredTransactionWrapper,
} from './typechain-runtime'

export class Cached extends TypeChainContract {
  public readonly rawWeb3Contract: any

  public constructor(web3: any, address: string | BigNumber) {
    const abi = [
      {
        inputs: [{ name: '_cacher', type: 'address' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'constructor',
      },
    ]
    super(web3, address, abi)
  }

  static async createAndValidate(
    web3: any,
    address: string | BigNumber
  ): Promise<Cached> {
    const contract = new Cached(web3, address)
    const code = await promisify(web3.eth.getCode, [address])
    if (code === '0x0') {
      throw new Error(`Contract at ${address} doesn't exist!`)
    }
    return contract
  }
}
