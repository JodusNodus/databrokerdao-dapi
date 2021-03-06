pragma solidity ^0.4.20;

import "@settlemint/solidity-mint/contracts/marketplaces/tokensystem/TokenRegistry.sol";

/**
 * Contains all the DTX tokens: in this case, there is only one
 */
contract DtxTokenRegistry is TokenRegistry {

  function DtxTokenRegistry(address _gateKeeper) TokenRegistry(_gateKeeper) public {}

}
