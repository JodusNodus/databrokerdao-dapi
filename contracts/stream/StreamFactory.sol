pragma solidity ^0.4.20;

import "./Stream.sol";
import "./StreamRegistry.sol";
import "@settlemint/solidity-mint/contracts/marketplaces/tokencuratedregistry/ListingFactory.sol";


contract StreamFactory is ListingFactory {

  function StreamFactory(address _gateKeeper) ListingFactory(_gateKeeper) public {}

  function createListing(address _owner, uint _price, uint _stakeAmount, address _tcr, string _metadata) public {
    // Create listing
    Stream _newStream = new Stream(_owner, _price, _stakeAmount, gateKeeper);

    // Metadata role
    gateKeeper.createPermission(
      msg.sender,
      address(_newStream),
      bytes32("UPDATE_METADATA_ROLE"),
      msg.sender
    );

    // Add metadata
    _newStream.updateMetaData(_metadata);

    // Event
    ListingCreated(address(_newStream));

    // Add listing to token curated registry
    StreamRegistry streamRegistry = StreamRegistry(_tcr);
    streamRegistry.addListing(address(_newStream));
  }
}
