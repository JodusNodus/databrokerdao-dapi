pragma solidity ^0.4.11;

import "@settlemint/solidity-mint/contracts/marketplaces/tokencuratedregistry/TokenCuratedRegistry.sol";
import "@settlemint/solidity-mint/contracts/marketplaces/tokensystem/Token.sol";


contract SensorRegistry is TokenCuratedRegistry {

  // Initial values, these can be changed with setters
  uint MIN_ENLIST_AMOUNT = 10;
  uint MIN_CHALLENGE_AMOUNT = 5;
  uint ADMIN_PERCENTAGE = 10;

  uint salePercentage = 5;

  /**
  @dev Contructor
  @notice                Sets the address for token
  @param _gateKeeper     Address of the gatekeeper
  @param _token          Address of the token
  */
  function SensorRegistry(
    address _gateKeeper,
    address _token
  )
    TokenCuratedRegistry(
      "SensorRegistry",
      _gateKeeper,
      _token,
      MIN_ENLIST_AMOUNT,
      MIN_CHALLENGE_AMOUNT,
      ADMIN_PERCENTAGE
    )
    public
  {}

  /**
  @notice                Lets the sender buy access to the sensor
  @param _listing        Id of the listing
  @param _startDate      Timestamp of when the user can start receiving sensor readings
  @param _endDate        Timestamp of when the will stop receiving sensor readings
  */
  // function buy(bytes32 _listing, uint _startDate, uint _endDate) public {
  //   Listing storage listing = listings[_listing];

  //   require(msg.sender.balance >= listing.price)
  // }

  /**
  @notice                Sets the sale percentage
  @param _salePercentage salePercentage
  */
  function setSalePercentage(uint _salePercentage) public {
    salePercentage = _salePercentage;
  }

}
