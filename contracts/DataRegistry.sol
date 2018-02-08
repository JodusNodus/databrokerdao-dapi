pragma solidity ^0.4.11;

import "@settlemint/solidity-mint/contracts/marketplaces/tokencuratedregistry/TokenCuratedRegistry.sol";


contract DataRegistry is TokenCuratedRegistry {

  uint MIN_ENLIST_AMOUNT = 10;
  uint MIN_CHALLENGE_AMOUNT = 5;
  uint ADMIN_PERCENTAGE = 10;

  /**
  @dev Contructor
  @notice                Sets the address for token
  @param _gateKeeper     Address of the gatekeeper
  @param _token          Address of the token
  */
  function DataRegistry(
    address _gateKeeper,
    address _token
  ) 
    TokenCuratedRegistry(
      _gateKeeper,
      _token,
      MIN_ENLIST_AMOUNT,
      MIN_CHALLENGE_AMOUNT,
      ADMIN_PERCENTAGE
    )
    public 
  {}

}
