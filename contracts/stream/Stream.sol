pragma solidity ^0.4.20;

import "../purchase/Purchase.sol";
import "@settlemint/solidity-mint/contracts/marketplaces/tokencuratedregistry/Listing.sol";


contract Stream is Listing, Syncable {

  // We store a mapping of purchases per stream
  mapping (address => Purchase) public purchases;
  address[] purchasesIndex;

  /**
  @dev Contructor
  @notice                Sets the address for token
  @param _owner          Address of the owner
  @param _price          Price for the listing
  @param _stakeAmount    Amount staked for the listing
  @param _gateKeeper     Address of the gatekeeper
  */
  function Stream(
    address _owner,
    uint _price,
    uint _stakeAmount,
    address _gateKeeper
  )
    Listing(_owner, _price, _stakeAmount, _gateKeeper)
    public
  {}

  /**
  @notice                Adds a purchase to the purchases mapping, indexed by address of the purchaser
  @param _purchase          Address of the purchase
  @param _purchaser     Address of the person who purchased
  */
  function addPurchase(address _purchase, address _purchaser) external {
    purchases[_purchaser] = Purchase(_purchase);
    purchasesIndex.push(_purchaser);
  }

  /**
  * implementation of cacher methods
  */
  function invalidateCache(address _cachedAddress, bytes32 /*_cachedBytes32*/, uint256 /*_cachedUint256*/) public {
    AddressCacheInvalidated(_cachedAddress);
    super.invalidateCache();
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
  * implementation of metadata methods
  */
  function updateMetaData(string ipfsHash) public {
    super.updateMetaData(ipfsHash);
    super.invalidateCache();
  }
}
