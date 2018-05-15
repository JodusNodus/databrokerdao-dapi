pragma solidity ^0.4.20;

import "@settlemint/solidity-mint/contracts/utility/upgrading/Dispatcher.sol";
import "@settlemint/solidity-mint/contracts/marketplaces/tokensystem/interfaces/IToken.sol";
import "@settlemint/solidity-mint/contracts/marketplaces/tokencuratedregistry/interfaces/IListing.sol";
import "@settlemint/solidity-mint/contracts/marketplaces/tokencuratedregistry/interfaces/IListingFactory.sol";
import "@settlemint/solidity-mint/contracts/marketplaces/tokencuratedregistry/ChallengeRegistry.sol";
import "@settlemint/solidity-mint/contracts/utility/caching/CachedByAddress.sol";



/**
 * Dispatches calls to the sensor factory
 */
contract SensorFactoryDispatcher is Dispatcher, CachedByAddress {

  function SensorFactoryDispatcher(
    address _gateKeeper
  )
    Secured(_gateKeeper)
    CachedByAddress(this)
    public
  {}

  function setTarget(address _target) public {
    super.setTarget(_target);
    super.invalidateCache();
  }
}
