pragma solidity ^0.4.20;

import "./Purchase.sol";
import "../sensor/Sensor.sol";
import "../sensor/SensorRegistry.sol";
import "../dtxtoken/DtxToken.sol";
import "@settlemint/solidity-mint/contracts/authentication/Secured.sol";
import "@settlemint/solidity-mint/contracts/authentication/GateKeeper.sol";
import "@settlemint/solidity-mint/contracts/utility/syncing/Syncable.sol";
import "@settlemint/solidity-mint/contracts/utility/caching/Cacher.sol";
import "@settlemint/solidity-mint/contracts/utility/caching/CachedByBytes32.sol";

/**
 * Contains all purchases of sensors
 */
contract PurchaseRegistry is Secured, Syncable, Cacher, CachedByBytes32 {
  using SafeMath for uint256;

  bytes32 constant public CREATE_PERMISSIONS_ROLE = "CREATE_PERMISSIONS_ROLE";
  bytes32 constant public CHANGE_SETTINGS_ROLE = "CHANGE_SETTINGS_ROLE";

  event AccessPurchased(address sensor, address user, uint startTime, uint endTime, uint price, address purchase);
  event SalePercentageChanged(uint value);

  mapping (address => Purchase) public purchases;
  address[] public purchasesIndex;

  DtxToken public token;
  SensorRegistry sensorRegistry;
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
    address _sensorRegistry
  )
    Secured(_gateKeeper)
    CachedByBytes32("PurchaseRegistry", this)
    public
  {
    token = DtxToken(_token);
    sensorRegistry = SensorRegistry(_sensorRegistry);
  }

  /**
  @notice               Lets the sender buy access to the sensor
  @param _sensor        Id of the listing
  @param _endTime       Timestamp of when the user will stop receiving sensor readings in seconds (not milliseconds!)
  */
  function purchaseAccess(address _sensor, uint _endTime, string _metadata) public {
    // Calculate total cost for the user.
    // If endtime is 0, the purchase is forever, and the price is just the price as listed.
    uint _sensorPricePerSecond;
    uint _startTime = now;
    uint _sensorPrice;
    if (_endTime == 0) {
      _sensorPricePerSecond = Sensor(_sensor).price();
      _sensorPrice = _sensorPricePerSecond;
    } else {
      _sensorPricePerSecond = Sensor(_sensor).price();
      _sensorPrice = _sensorPricePerSecond.mul(_endTime.sub(_startTime));
    }

    // Pay out:
    uint _salePercentage = _sensorPrice.mul(salePercentage.div(100));
    // Sensor owner
    require(token.transferFrom(msg.sender, Sensor(_sensor).owner(), _sensorPrice.sub(_salePercentage)));
    // DBDAO
    require(token.transferFrom(msg.sender, this, _salePercentage));

    // Create purchase
    Purchase _purchase = new Purchase(
      _sensorPricePerSecond,
      _startTime,
      _endTime,
      msg.sender,
      _sensor,
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

    emit AccessPurchased(_sensor, msg.sender, _startTime, _endTime, _sensorPrice, address(_purchase));
    invalidateCache(_purchase, "", 0);
  }

  /**
  @notice                Sets the sale percentage
  @param _salePercentage salePercentage
  */
  function setSalePercentage(uint _salePercentage) auth(CHANGE_SETTINGS_ROLE) public {
    salePercentage = _salePercentage;
    emit SalePercentageChanged(_salePercentage);
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
  function invalidateCache(address _cachedAddress, bytes32 /*_cachedBytes32*/, uint256 /*_cachedUint256*/) public {
    emit AddressCacheInvalidated(_cachedAddress);
  }
}
