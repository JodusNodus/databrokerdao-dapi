pragma solidity ^0.4.20;

import "./Purchase.sol";
import "../stream/Stream.sol";
import "../stream/StreamRegistry.sol";
import "../dtxtoken/DtxToken.sol";
import "@settlemint/solidity-mint/contracts/authentication/Secured.sol";
import "@settlemint/solidity-mint/contracts/authentication/GateKeeper.sol";
import "@settlemint/solidity-mint/contracts/utility/syncing/Syncable.sol";
import "@settlemint/solidity-mint/contracts/utility/caching/Cacher.sol";
import "@settlemint/solidity-mint/contracts/utility/caching/CachedByBytes32.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";


contract PurchaseRegistry is Secured, Syncable, Cacher, CachedByBytes32 {
  using SafeMath for uint256;

  bytes32 constant public CREATE_PERMISSIONS_ROLE = "CREATE_PERMISSIONS_ROLE";

  event AccessPurchased(address stream, address user, uint startTime, uint endTime, uint price, address purchase);

  mapping (address => Purchase) public purchases;
  address[] public purchasesIndex;

  DtxToken public token;
  StreamRegistry streamRegistry;
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
  }

  /**
  @notice               Lets the sender buy access to the Stream
  @param _stream        Id of the listing
  @param _endTime       Timestamp of when the user will stop receiving Stream readings in seconds (not milliseconds!)
  */
  function purchaseAccess(address _stream, uint _endTime, string _metadata) public {
    // Calculate total cost for the user
    uint _streamPricePerSecond = Stream(_stream).price();
    uint _startTime = now;
    uint _streamPrice = _streamPricePerSecond.mul(_endTime.sub(_startTime));

    // Pay out:
    uint _salePercentage = _streamPrice.mul(salePercentage.div(100));
    // Sensor owner
    require(token.transferFrom(msg.sender, Stream(_stream).owner(), _streamPrice.sub(_salePercentage)));
    // DBDAO
    require(token.transferFrom(msg.sender, this, _salePercentage));

    // Create purchase
    Purchase _purchase = new Purchase(
      _streamPricePerSecond,
      _startTime,
      _endTime,
      msg.sender,
      _stream,
      address(gateKeeper)
    );

    // Metadata role
    gateKeeper.createPermission(
      msg.sender,
      address(_purchase),
      bytes32("UPDATE_METADATA_ROLE"),
      msg.sender
    );

    // Add metadata
    _purchase.updateMetaData(_metadata);

    // Push to mapping
    purchases[address(_purchase)] = Purchase(address(_purchase));
    purchasesIndex.push(address(_purchase));

    AccessPurchased(_stream, msg.sender, _startTime, _endTime, _streamPrice, address(_purchase));
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
    length = purchasesIndex.length;
  }

  function getByIndex(uint index) public view returns (address key, address contractAddress) {
    return getByKey(purchasesIndex[index]);
  }

  function getByKey(address _key) public view returns (address key, address contractAddress) {
    key = address(purchases[_key]);
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
