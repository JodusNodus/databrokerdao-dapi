pragma solidity ^0.4.20;

import "../dtxtoken/DtxToken.sol";
import "@settlemint/solidity-mint/contracts/authentication/Secured.sol";
import "@settlemint/solidity-mint/contracts/authentication/GateKeeper.sol";

/**
 * Allows a user to mint demo DTX tokens for his own address
 */
contract DtxMinter is Secured {
  event Minted(address to, uint amount);

  DtxToken public token;

  /**
  @dev Contructor
  @notice                Sets the address for token
  @param _token          Address of the token
  @param _gateKeeper     Address of the gatekeeper
  */
  function DtxMinter(
    address _token,
    address _gateKeeper
  )
    Secured(_gateKeeper)
    public
  {
    token = DtxToken(_token);
  }

  /**
  @notice               Mints demo DTX for the user calling this method.
  @param _amount        How much DTX to mint for this user
  */
  function mint(uint _amount) public {
    token.mint(msg.sender, _amount);

    // Event
    emit Minted(msg.sender, _amount);
  }
}
