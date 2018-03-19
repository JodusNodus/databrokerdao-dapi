pragma solidity ^0.4.20;

import "@settlemint/solidity-mint/contracts/authentication/RoleRegistry.sol";


/**
 * Contains all the normal users of this system
 */
contract Curators is RoleRegistry {

  function Curators(address _gateKeeper) RoleRegistry(_gateKeeper) public {}

}
