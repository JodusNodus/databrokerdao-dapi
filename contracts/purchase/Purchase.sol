pragma solidity ^0.4.20;

import "@settlemint/solidity-mint/contracts/authentication/Secured.sol";
import "@settlemint/solidity-mint/contracts/utility/syncing/Syncable.sol";
import "@settlemint/solidity-mint/contracts/utility/caching/Cacher.sol";
import "@settlemint/solidity-mint/contracts/utility/caching/CachedByAddress.sol";


contract Purchase is Secured, Cacher, CachedByAddress {

  uint public price; // price per second for which access was purchased
  uint public startTime; // the time at which the purchaser will gain access to this Stream
  uint public endTime; // the time at which the purchaser will lose access to this Stream
  address public purchaser; // address of the user
  address public stream; // id of the stream to which access was purchased

  function Purchase(
    uint _price,
    uint _startTime,
    uint _endTime,
    address _purchaser,
    address _stream,
    address _gateKeeper
  )
    Secured(_gateKeeper)
    CachedByAddress(this)
  {
    price = _price;
    startTime = _startTime;
    endTime = _endTime;
    purchaser = _purchaser;
    stream = _stream;
  }

  /**
  * implementation of cacher methods
  */
  function invalidateCache(address _cachedAddress, bytes32 /*_cachedBytes32*/, uint256 /*_cachedUint256*/) public {
    AddressCacheInvalidated(_cachedAddress);
    super.invalidateCache();
  }
}
