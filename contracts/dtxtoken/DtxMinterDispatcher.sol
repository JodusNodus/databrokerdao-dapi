pragma solidity ^0.4.20;

import "../dtxtoken/DtxToken.sol";
import "@settlemint/solidity-mint/contracts/authentication/Secured.sol";
import "@settlemint/solidity-mint/contracts/authentication/GateKeeper.sol";
import "@settlemint/solidity-mint/contracts/utility/upgrading/Dispatcher.sol";


contract DtxMinterDispatcher is Dispatcher {
  event Minted(address to, uint amount);

  DtxToken public token;

  function DtxMinterDispatcher(address _token, address gatekeeper)
    Secured(gatekeeper)
    public
  {
    token = DtxToken(_token);
  }
}
