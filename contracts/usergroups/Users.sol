pragma solidity ^0.4.11;

import "@settlemint/solidity-mint/contracts/authentication/RoleRegistry.sol";


/**
 * Contains all the normal users of this system
 */
contract Users is RoleRegistry {

  function Users(address _gateKeeper) RoleRegistry(_gateKeeper) public {}

}