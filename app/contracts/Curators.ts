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

export class Curators extends TypeChainContract {
  public readonly rawWeb3Contract: any

  public constructor(web3: any, address: string | BigNumber) {
    const abi = [
      {
        constant: false,
        inputs: [{ name: '_address', type: 'address' }],
        name: 'discharge',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'DESIGNATE_ROLE',
        outputs: [{ name: '', type: 'bytes32' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [{ name: '_index', type: 'uint256' }],
        name: 'getByIndex',
        outputs: [
          { name: 'key', type: 'address' },
          { name: 'hasTheRole', type: 'bool' },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          { name: '_cachedAddress', type: 'address' },
          { name: '', type: 'bytes32' },
          { name: '', type: 'uint256' },
        ],
        name: 'invalidateCache',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [{ name: '_address', type: 'address' }],
        name: 'designate',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'gateKeeper',
        outputs: [{ name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [{ name: '_key', type: 'address' }],
        name: 'getByKey',
        outputs: [
          { name: 'key', type: 'address' },
          { name: 'hasTheRole', type: 'bool' },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [{ name: '_address', type: 'address' }],
        name: 'hasRole',
        outputs: [{ name: 'hasTheRole', type: 'bool' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'getIndexLength',
        outputs: [{ name: 'length', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [{ name: '_gateKeeper', type: 'address' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'constructor',
      },
      {
        anonymous: false,
        inputs: [{ indexed: false, name: '_address', type: 'address' }],
        name: 'Designated',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [{ indexed: false, name: '_address', type: 'address' }],
        name: 'Discharged',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [{ indexed: false, name: '_address', type: 'address' }],
        name: 'RoleRegistryCreated',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [{ indexed: true, name: 'key', type: 'address' }],
        name: 'AddressCacheInvalidated',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [{ indexed: true, name: 'key', type: 'bytes32' }],
        name: 'Bytes32CacheInvalidated',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [{ indexed: true, name: 'key', type: 'uint256' }],
        name: 'Uint256CacheInvalidated',
        type: 'event',
      },
    ]
    super(web3, address, abi)
  }

  static async createAndValidate(
    web3: any,
    address: string | BigNumber
  ): Promise<Curators> {
    const contract = new Curators(web3, address)
    const code = await promisify(web3.eth.getCode, [address])
    if (code === '0x0') {
      throw new Error(`Contract at ${address} doesn't exist!`)
    }
    return contract
  }

  public get DESIGNATE_ROLE(): Promise<BigNumber> {
    return promisify(this.rawWeb3Contract.DESIGNATE_ROLE, [])
  }
  public get gateKeeper(): Promise<string> {
    return promisify(this.rawWeb3Contract.gateKeeper, [])
  }
  public get getIndexLength(): Promise<BigNumber> {
    return promisify(this.rawWeb3Contract.getIndexLength, [])
  }
  public getByIndex(_index: BigNumber | number): Promise<[string, boolean]> {
    return promisify(this.rawWeb3Contract.getByIndex, [_index.toString()])
  }
  public getByKey(_key: BigNumber | string): Promise<[string, boolean]> {
    return promisify(this.rawWeb3Contract.getByKey, [_key.toString()])
  }
  public hasRole(_address: BigNumber | string): Promise<boolean> {
    return promisify(this.rawWeb3Contract.hasRole, [_address.toString()])
  }

  public dischargeTx(
    _address: BigNumber | string
  ): DeferredTransactionWrapper<ITxParams> {
    return new DeferredTransactionWrapper<ITxParams>(this, 'discharge', [
      _address.toString(),
    ])
  }
  public invalidateCacheTx(
    _cachedAddress: BigNumber | string,
    arg1: BigNumber,
    arg2: BigNumber | number
  ): DeferredTransactionWrapper<ITxParams> {
    return new DeferredTransactionWrapper<ITxParams>(this, 'invalidateCache', [
      _cachedAddress.toString(),
      arg1.toString(),
      arg2.toString(),
    ])
  }
  public designateTx(
    _address: BigNumber | string
  ): DeferredTransactionWrapper<ITxParams> {
    return new DeferredTransactionWrapper<ITxParams>(this, 'designate', [
      _address.toString(),
    ])
  }
}
