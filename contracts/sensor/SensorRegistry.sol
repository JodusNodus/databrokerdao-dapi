pragma solidity ^0.4.20;

import "@settlemint/solidity-mint/contracts/marketplaces/tokencuratedregistry/TokenCuratedRegistry.sol";
import "@settlemint/solidity-mint/contracts/marketplaces/tokensystem/Token.sol";

/**
 * Contains all sensors
 */
contract SensorRegistry is TokenCuratedRegistry {

  // Initial values, these can be changed with setters
  uint MIN_ENLIST_AMOUNT = 10;
  uint MIN_CHALLENGE_AMOUNT = 5;
  uint CURATOR_PERCENTAGE = 10;

  /**
  @dev Contructor
  @notice                Sets the address for token
  @param _gateKeeper     Address of the gatekeeper
  @param _token          Address of the token
  */
  function SensorRegistry(
    address _gateKeeper,
    address _token,
    address _listingFactory,
    address _challengeRegistry
  )
    TokenCuratedRegistry(
      _gateKeeper,
      _token,
      _listingFactory,
      _challengeRegistry,
      MIN_ENLIST_AMOUNT,
      MIN_CHALLENGE_AMOUNT,
      CURATOR_PERCENTAGE
    )
    public
  {}
}
