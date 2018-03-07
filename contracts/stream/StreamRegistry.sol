pragma solidity ^0.4.17;

import "@settlemint/solidity-mint/contracts/marketplaces/tokencuratedregistry/TokenCuratedRegistry.sol";
import "@settlemint/solidity-mint/contracts/marketplaces/tokensystem/Token.sol";


contract StreamRegistry is TokenCuratedRegistry {

  // Initial values, these can be changed with setters
  uint MIN_ENLIST_AMOUNT = 10;
  uint MIN_CHALLENGE_AMOUNT = 5;
  uint ADMIN_PERCENTAGE = 10;

  /**
  @dev Contructor
  @notice                Sets the address for token
  @param _gateKeeper     Address of the gatekeeper
  @param _token          Address of the token
  */
  function StreamRegistry(
    address _gateKeeper,
    address _token,
    address _listingFactory
  )
    TokenCuratedRegistry(
      _gateKeeper,
      _token,
      _listingFactory,
      MIN_ENLIST_AMOUNT,
      MIN_CHALLENGE_AMOUNT,
      ADMIN_PERCENTAGE
    )
    public
  {}

  /**
  @notice                Gets the price of a stream
  @param _listing        key of the listing
  */
  function getStreamPrice(address _listing) view public returns (uint price) {
    return IListing(listings[_listing]).price();
  }

  /**
  @notice                Gets the owner of a stream
  @param _listing        key of the listing
  */
  function getStreamOwner(address _listing) view public returns (address owner) {
    return IListing(listings[_listing]).owner();
  }
}
