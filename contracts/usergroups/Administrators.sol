pragma solidity ^0.4.20;

import "@settlemint/solidity-mint/contracts/authentication/RoleRegistry.sol";


/**
 * Contains all the administrators of this system
 */
contract Administrators is RoleRegistry {

  function Administrators(address _gateKeeper) RoleRegistry(_gateKeeper) public {}

}
