pragma solidity ^0.4.17;

import "./StreamRegistry.sol";
import "./dtxtoken/DtxToken.sol";
import "@settlemint/solidity-mint/contracts/authentication/Secured.sol";
import "@settlemint/solidity-mint/contracts/utility/syncing/Syncable.sol";
import "@settlemint/solidity-mint/contracts/utility/caching/Cacher.sol";
import "@settlemint/solidity-mint/contracts/utility/caching/CachedByBytes32.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";


contract StreamPurchasing is Secured, Syncable, Cacher, CachedByBytes32 {
  using SafeMath for uint256;

  event AccessPurchased(bytes32 listing, address user, uint startTime, uint endTime, uint price);

  struct Stream {
    uint pricePerSecond;
    mapping (address => Purchase) purchases; // the list of purchases
    address[] purchasers; // a list of all the keys in the mapping
  }

  struct Purchase {
    uint endTime; // the time at which the purchaser will lose access to this Stream
  }

  mapping (bytes32 => Stream) public streams;
  bytes32[] streamsIndex;

  DtxToken public token;
  StreamRegistry streamRegistry;
  uint salePercentage = 1;

  /**
  @dev Contructor
  @notice                Sets the address for token
  @param _gateKeeper     Address of the gatekeeper
  @param _token          Address of the token
  */
  function StreamPurchasing(
    address _gateKeeper,
    address _token,
    address _streamRegistry
  )
    Secured(_gateKeeper)
    CachedByBytes32("StreamPurchasing", this)
    public
  {
    token = DtxToken(_token);
    streamRegistry = StreamRegistry(_streamRegistry);
  }

  /**
  @notice               Lets the sender buy access to the Stream
  @param _stream        Id of the listing
  @param _endTime       Timestamp of when the user will stop receiving Stream readings in seconds (not milliseconds!)
  */
  function purchaseAccess(bytes32 _stream, uint _endTime) public {
    Stream storage stream = streams[_stream];

    // Check if user doesn't have access to this stream yet
    require(stream.purchases[msg.sender].endTime == 0);

    // Calculate total cost for the user
    uint _streamPricePerSecond = streamRegistry.getStreamPrice(_stream);
    uint _startTime = now;
    uint _streamPrice = _streamPricePerSecond.mul(_endTime.sub(_startTime));

    // Pay out:
    uint _salePercentage = _streamPrice.mul(salePercentage.div(100));
    // Sensor owner
    require(token.transferFrom(msg.sender, streamRegistry.getStreamOwner(_stream), _streamPrice.sub(_salePercentage)));
    // DBDAO
    require(token.transferFrom(msg.sender, this, _salePercentage));

    // Add purchase
    stream.purchases[msg.sender] = Purchase({
      endTime: _endTime
    });

    // Add sender to the purchasers array
    stream.purchasers.push(msg.sender);

    AccessPurchased(_stream, msg.sender, _startTime, _endTime, _streamPrice);
  }

  /**
  @notice               Returns whether or not the sender has access to this listing
  @param _stream        Id of the listing
  */
  function hasAccess(bytes32 _stream) public returns (bool hasAccess){
    if (streams[_stream].purchases[msg.sender].endTime == 0) {
      return false;
    }
    return true;
  }

  /**
  @notice                Sets the sale percentage
  @param _salePercentage salePercentage
  */
  function setSalePercentage(uint _salePercentage) public {
    salePercentage = _salePercentage;
  }

  /**
  * implementation of syncable methods
  */
  function getIndexLength() public view returns (uint length) {
    length = streamsIndex.length;
  }

  function getByIndex(uint index) public view returns (bytes32 key, address contractAddress) {
    return getByKey(streamsIndex[index]);
  }

  function getByKey(bytes32 _key) public view returns (bytes32 key, address /*contractAddress*/) {
    key = _key;
  }

  /**
  * implementation of cacher methods
  */
  function invalidateCache(address /*_cachedAddress*/, bytes32 _cachedBytes32, uint256 /*_cachedUint256*/) public {
    Bytes32CacheInvalidated(_cachedBytes32);
    super.invalidateCache();
  }
}
