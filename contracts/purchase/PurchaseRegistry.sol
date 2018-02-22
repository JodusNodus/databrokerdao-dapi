pragma solidity ^0.4.20;
pragma experimental ABIEncoderV2;

import "./Purchase.sol";
import "../stream/Stream.sol";
import "../stream/StreamRegistry.sol";
import "../dtxtoken/DtxToken.sol";
import "@settlemint/solidity-mint/contracts/authentication/Secured.sol";
import "@settlemint/solidity-mint/contracts/utility/syncing/Syncable.sol";
import "@settlemint/solidity-mint/contracts/utility/caching/Cacher.sol";
import "@settlemint/solidity-mint/contracts/utility/caching/CachedByBytes32.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";


contract PurchaseRegistry is Secured, Syncable, Cacher, CachedByBytes32 {
  using SafeMath for uint256;

  event AccessPurchased(address stream, address user, uint startTime, uint endTime, uint price, address purchase);

  mapping (address => Purchase) public purchases;
  address[] public purchasesIndex;

  DtxToken public token;
  StreamRegistry streamRegistry;
  address gateKeeper;
  uint salePercentage = 1;

  /**
  @dev Contructor
  @notice                Sets the address for token
  @param _gateKeeper     Address of the gatekeeper
  @param _token          Address of the token
  */
  function PurchaseRegistry(
    address _gateKeeper,
    address _token,
    address _streamRegistry
  )
    Secured(_gateKeeper)
    CachedByBytes32("PurchaseRegistry", this)
    public
  {
    token = DtxToken(_token);
    streamRegistry = StreamRegistry(_streamRegistry);

    gateKeeper = _gateKeeper;
  }

  /**
  @notice               Lets the sender buy access to the Stream
  @param _stream        Id of the listing
  @param _endTime       Timestamp of when the user will stop receiving Stream readings in seconds (not milliseconds!)
  */
  function purchaseAccess(address _stream, uint _endTime) public {
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

    // Create purchase
    Purchase purchase = new Purchase(
      _streamPricePerSecond,
      _startTime,
      _endTime,
      msg.sender,
      _stream,
      gateKeeper
    );

    // Push to mapping
    purchases[address(purchase)] = purchase;
    purchasesIndex.push(msg.sender);

    // Push to mapping in the stream
    Stream(_stream).addPurchase(address(purchase), msg.sender);

    AccessPurchased(_stream, msg.sender, _startTime, _endTime, _streamPrice, address(purchase));
  }

  /**
  @notice               Returns whether or not the sender has access to this listing
  @param _stream        Id of the listing
  */
  function hasAccess(bytes32 _stream) public returns (bool access){
    // if (streams[_stream].purchases[msg.sender].endTime == 0) {
    //   return false;
    // }
    return true;
  }

  /**
  @notice               Returns array of ids of streams the user has access to
  */
  // function getAllPurchases() public returns (bytes32[] purchases) {
  //   return userPurchases[msg.sender];
  // }

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
    length = purchasesIndex.length;
  }

  function getByIndex(uint index) public view returns (bytes32 /*key*/, address contractAddress) {
    return getByKey(purchasesIndex[index]);
  }

  function getByKey(address _key) public view returns (bytes32 /*key*/, address contractAddress) {
    contractAddress = address(purchases[_key]);
  }

  /**
  * implementation of cacher methods
  */
  function invalidateCache(address /*_cachedAddress*/, bytes32 _cachedBytes32, uint256 /*_cachedUint256*/) public {
    Bytes32CacheInvalidated(_cachedBytes32);
    super.invalidateCache();
  }
}
