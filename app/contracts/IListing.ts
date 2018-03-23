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

export class IListing extends TypeChainContract {
  public readonly rawWeb3Contract: any

  public constructor(web3: any, address: string | BigNumber) {
    const abi = [
      {
        constant: true,
        inputs: [],
        name: 'challenges',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'metadata',
        outputs: [{ name: '', type: 'string' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'stake',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          { name: '_cachedAddress', type: 'address' },
          { name: '_cachedBytes32', type: 'bytes32' },
          { name: '_cachedUint256', type: 'uint256' },
        ],
        name: 'invalidateCache',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'whitelisted',
        outputs: [{ name: '', type: 'bool' }],
        payable: false,
        stateMutability: 'view',
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
        inputs: [],
        name: 'challengesStake',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'owner',
        outputs: [{ name: '', type: 'address' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'price',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [{ name: '', type: 'uint256' }],
        name: 'challengeIDs',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'UPDATE_METADATA_ROLE',
        outputs: [{ name: '', type: 'bytes32' }],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        inputs: [
          { name: '_owner', type: 'address' },
          { name: '_price', type: 'uint256' },
          { name: '_stakeAmount', type: 'uint256' },
          { name: '_gateKeeper', type: 'address' },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'constructor',
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
      {
        constant: false,
        inputs: [{ name: '_stake', type: 'uint256' }],
        name: 'setStake',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [{ name: '_totalStake', type: 'uint256' }],
        name: 'setChallengesStake',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [{ name: '_challenges', type: 'uint256' }],
        name: 'setChallenges',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [{ name: '_whitelisted', type: 'bool' }],
        name: 'setWhitelisted',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [{ name: '_price', type: 'uint256' }],
        name: 'setPrice',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [{ name: '_challengeID', type: 'uint256' }],
        name: 'addChallengeID',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [],
        name: 'getChallengeIDsLength',
        outputs: [{ name: 'length', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [{ name: '_index', type: 'uint256' }],
        name: 'getChallengeIDAtIndex',
        outputs: [{ name: 'challengeID', type: 'uint256' }],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: false,
        inputs: [{ name: 'ipfsHash', type: 'string' }],
        name: 'updateMetaData',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ]
    super(web3, address, abi)
  }

  static async createAndValidate(
    web3: any,
    address: string | BigNumber
  ): Promise<IListing> {
    const contract = new IListing(web3, address)
    const code = await promisify(web3.eth.getCode, [address])
    if (code === '0x0') {
      throw new Error(`Contract at ${address} doesn't exist!`)
    }
    return contract
  }

  public get challenges(): Promise<BigNumber> {
    return promisify(this.rawWeb3Contract.challenges, [])
  }
  public get metadata(): Promise<string> {
    return promisify(this.rawWeb3Contract.metadata, [])
  }
  public get stake(): Promise<BigNumber> {
    return promisify(this.rawWeb3Contract.stake, [])
  }
  public get whitelisted(): Promise<boolean> {
    return promisify(this.rawWeb3Contract.whitelisted, [])
  }
  public get gateKeeper(): Promise<string> {
    return promisify(this.rawWeb3Contract.gateKeeper, [])
  }
  public get challengesStake(): Promise<BigNumber> {
    return promisify(this.rawWeb3Contract.challengesStake, [])
  }
  public get owner(): Promise<string> {
    return promisify(this.rawWeb3Contract.owner, [])
  }
  public get price(): Promise<BigNumber> {
    return promisify(this.rawWeb3Contract.price, [])
  }
  public get UPDATE_METADATA_ROLE(): Promise<BigNumber> {
    return promisify(this.rawWeb3Contract.UPDATE_METADATA_ROLE, [])
  }
  public challengeIDs(arg0: BigNumber | number): Promise<BigNumber> {
    return promisify(this.rawWeb3Contract.challengeIDs, [arg0.toString()])
  }

  public invalidateCacheTx(
    _cachedAddress: BigNumber | string,
    _cachedBytes32: BigNumber,
    _cachedUint256: BigNumber | number
  ): DeferredTransactionWrapper<ITxParams> {
    return new DeferredTransactionWrapper<ITxParams>(this, 'invalidateCache', [
      _cachedAddress.toString(),
      _cachedBytes32.toString(),
      _cachedUint256.toString(),
    ])
  }
  public setStakeTx(
    _stake: BigNumber | number
  ): DeferredTransactionWrapper<ITxParams> {
    return new DeferredTransactionWrapper<ITxParams>(this, 'setStake', [
      _stake.toString(),
    ])
  }
  public setChallengesStakeTx(
    _totalStake: BigNumber | number
  ): DeferredTransactionWrapper<ITxParams> {
    return new DeferredTransactionWrapper<ITxParams>(
      this,
      'setChallengesStake',
      [_totalStake.toString()]
    )
  }
  public setChallengesTx(
    _challenges: BigNumber | number
  ): DeferredTransactionWrapper<ITxParams> {
    return new DeferredTransactionWrapper<ITxParams>(this, 'setChallenges', [
      _challenges.toString(),
    ])
  }
  public setWhitelistedTx(
    _whitelisted: boolean
  ): DeferredTransactionWrapper<ITxParams> {
    return new DeferredTransactionWrapper<ITxParams>(this, 'setWhitelisted', [
      _whitelisted.toString(),
    ])
  }
  public setPriceTx(
    _price: BigNumber | number
  ): DeferredTransactionWrapper<ITxParams> {
    return new DeferredTransactionWrapper<ITxParams>(this, 'setPrice', [
      _price.toString(),
    ])
  }
  public addChallengeIDTx(
    _challengeID: BigNumber | number
  ): DeferredTransactionWrapper<ITxParams> {
    return new DeferredTransactionWrapper<ITxParams>(this, 'addChallengeID', [
      _challengeID.toString(),
    ])
  }
  public getChallengeIDsLengthTx(): DeferredTransactionWrapper<ITxParams> {
    return new DeferredTransactionWrapper<ITxParams>(
      this,
      'getChallengeIDsLength',
      []
    )
  }
  public getChallengeIDAtIndexTx(
    _index: BigNumber | number
  ): DeferredTransactionWrapper<ITxParams> {
    return new DeferredTransactionWrapper<ITxParams>(
      this,
      'getChallengeIDAtIndex',
      [_index.toString()]
    )
  }
  public updateMetaDataTx(
    ipfsHash: string
  ): DeferredTransactionWrapper<ITxParams> {
    return new DeferredTransactionWrapper<ITxParams>(this, 'updateMetaData', [
      ipfsHash.toString(),
    ])
  }
}
