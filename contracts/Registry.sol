pragma solidity ^0.4.11;

import "tokens/eip20/EIP20.sol";


contract Registry {

  // ------
  // EVENTS
  // ------

  event Enlisted(bytes32 listing, uint deposit, string target);
  event Challenged(bytes32 listing, uint deposit, uint challengeID);
  event Unlisted(bytes32 listing);
  event ChallengeApproved(uint challengeID);
  event ChallengeDenied(uint challengeID);

  struct Listing {
    bool whitelisted;       // Should the data appear on the listing or not
    address owner;          // Owner of Listing
    uint stake;             // Number of unlocked tokens with potential risk if challenged
    string target;          // Identifier of the data
    uint[] challenges;      // Array of challengeIDs to this listing
  }

  struct Challenge {
    address challenger;     // Owner of Challenge
    bool resolved;          // Indication of if challenge is resolved
    uint stake;             // Number of tokens at risk for either party during challenge
  }

  // Maps listingHashes to associated listing data
  mapping(bytes32 => Listing) public listings;

  // Maps challenges to associated challenge data
  mapping(uint => Challenge) public challenges;

  // Global Variables
  EIP20 token;
  uint currentChallengeID;

  /**
  @dev Contructor
  @notice                 Sets the address for token
  @param _tokenAddr       Address of the native ERC20 token (ADT)
  */
  function Registry(
    address _tokenAddr
  ) public 
  {
    token = EIP20(_tokenAddr);
  }

  /**
  @notice                 Allows a seller to list data to be available for selling.
  @notice                 Takes tokens from user.
  @param _listing         The listing of data
  @param _stakeAmount     The number of ERC20 tokens a user is willing to potentially stake
  @param _target          String with ipfs hash of data
  */
  function enlist(bytes32 _listing, uint _stakeAmount, string _target) external {
    // Stake must be above a certain amount
    // TODO: make minStakeAmount a config var
    require(_stakeAmount >= 10);

    // Transfers tokens from user to Registry contract
    require(token.transferFrom(msg.sender, this, _stakeAmount));

    // Add listing to listings
    uint[] emptyArray;
    listings[_listing] = Listing({
      whitelisted: true,
      owner: msg.sender,
      stake: _stakeAmount,
      target: _target,
      challenges: emptyArray
    });

    // Event
    Enlisted(_listing, _stakeAmount, _target);
  }

  /**
  @notice             Allows the owner of a listing to remove the listing from the whitelist
  @notice             Returns all tokens to the owner of the listing
  @param _listing     The listing of a user's listing
  */
  function unlist(bytes32 _listing) external {
    Listing storage listing = listings[_listing];

    require(msg.sender == listing.owner);
    require(isWhitelisted(_listing));

    // Cannot exit during ongoing challenge
    require(listing.challenges.length == 0);

    // Transfers any remaining balance back to the owner
    if (listing.stake > 0)
      require(token.transfer(listing.owner, listing.stake));

    delete listings[_listing]; // delete changes the whitelisted prop from true to false
    Unlisted(_listing);
  }

  /**
  @notice             Allows the owner of a listing to increase their unstaked deposit.
  @param _listing     The listing of a user's application/listing
  @param _stakeAmount The number of ERC20 tokens to increase a user's unstaked deposit
  */
  // function increase(bytes32 _listing, uint _stakeAmount) external {
  //   Listing storage listing = listings[_listing];

  //   require(listing.owner == msg.sender);
  //   require(token.transferFrom(msg.sender, this, _stakeAmount));

  //   listing.stake += _stakeAmount;

  //   _Deposited(_listing, _stakeAmount, listing.stake);
  // }

  /**
  @notice             Allows the owner of a listing to decrease their unstaked deposit.
  @notice             The listing keeps its previous status.
  @param _listing     The listing of a user's application/listing
  @param _stakeAmount The number of ERC20 tokens to decrease a user's unstaked deposit
  */
  // function decrease(bytes32 _listing, uint _stakeAmount) external {
  //   Listing storage listing = listings[_listing];

  //   require(listing.owner == msg.sender);
  //   require(_stakeAmount <= listing.stake);
  //   require(listing.stake - _stakeAmount >= 10);

  //   require(token.transfer(msg.sender, _stakeAmount));

  //   listing.stake -= _stakeAmount;

  //   _Withdrawn(_listing, _stakeAmount, listing.stake);
  // }

  /**
  @notice             Starts a challenge for a listing.
  @dev                Tokens are taken from the challenger and the data seller's deposit is locked.
  @param _listing     The listing of data.
  @param _stakeAmount The amount the challenger wants to stake.
  */
  function challenge(bytes32 _listing, uint _stakeAmount) external returns (uint challengeID) {
    require(_stakeAmount >= 5);

    bytes32 listingHash = _listing;
    // Listing storage listing = listings[listingHash];

    // Prevent multiple challenges
    // require(listing.challengeID == 0 || challenges[listing.challengeID].resolved);

    // if (listing.stake < _stakeAmount) {
    //   // Not enough tokens, listing auto-delisted
    //   resetListing(_listing);
    //   return 0;
    // }

    // Takes tokens from challenger
    require(token.transferFrom(msg.sender, this, _stakeAmount));

    // Keep track of challenge id
    challengeID = currentChallengeID + 1;
    currentChallengeID = challengeID; 

    // Add challenge to the challenges mapping
    challenges[challengeID] = Challenge({
      challenger: msg.sender,
      stake: _stakeAmount,
      resolved: false
    });

    // Add challenge id to the right listing
    listings[_listing].challenges.push(challengeID); 

    // Locks tokens for listing during challenge
    listings[listingHash].stake -= _stakeAmount;

    Challenged(_listing, _stakeAmount, challengeID);
    return challengeID;
  }

   /**
  @notice             Marks a challenge as resolved.
  @notice             Rewards the winner tokens and either whitelists or de-whitelists the listing.
  @param _listing     A listing with a challenge that is to be resolved
  */
  function approveChallenge(bytes32 _listing) external {
    // bytes32 listingHash = _listing;
    // uint challengeID = listings[listingHash].challengeID;

    // // Calculates the winner's reward,
    // // which is: (winner's full stake) + (dispensationPct * loser's stake)
    // uint reward = determineReward(challengeID);

    // // Records whether the listing is a listing or an application
    // bool wasWhitelisted = isWhitelisted(_listing);

    // // Case: challenge failed
    // if (voting.isPassed(challengeID)) {
    //   whitelistApplication(_listing);
    //   // Unlock stake so that it can be retrieved by the applicant
    //   listings[listingHash].unstakedDeposit += reward;

    //   _ChallengedFailed(challengeID);
    //   if (!wasWhitelisted) { _NewListingWhitelisted(_listing); }
    // } else {
    //   resetListing(_listing);
    //   // Transfer the reward to the challenger
    //   require(token.transfer(challenges[challengeID].challenger, reward));

    //   _ChallengedSucceeded(challengeID);
    //   if (wasWhitelisted) { _ListingRemoved(_listing); }
    //   else {
    //     _ListingAddedRemoved(_listing); 
    //   }
    // }

    // // Sets flag on challenge being processed
    // challenges[challengeID].resolved = true;

    // // Stores the total tokens used for voting by the winning side for reward purposes
    // challenges[challengeID].totalTokens =
    //   voting.getTotalNumberOfTokensForWinningOption(challengeID);
  }

   /**
  @notice             Marks a challenge as denied.
  @notice             Rewards the listing seller tokens and de-whitelists the listing.
  @param _listing     A listing with a challenge that is to be resolved
  */
  function denyChallenge(bytes32 _listing) external {
    // bytes32 listingHash = _listing;
    // uint challengeID = listings[listingHash].challengeID;

    // // Calculates the winner's reward,
    // // which is: (winner's full stake) + (dispensationPct * loser's stake)
    // uint reward = determineReward(challengeID);

    // // Records whether the listing is a listing or an application
    // bool wasWhitelisted = isWhitelisted(_listing);

    // // Case: challenge failed
    // if (voting.isPassed(challengeID)) {
    //   whitelistApplication(_listing);
    //   // Unlock stake so that it can be retrieved by the applicant
    //   listings[listingHash].unstakedDeposit += reward;

    //   _ChallengedFailed(challengeID);
    //   if (!wasWhitelisted) { _NewListingWhitelisted(_listing); }
    // } else {
    //   resetListing(_listing);
    //   // Transfer the reward to the challenger
    //   require(token.transfer(challenges[challengeID].challenger, reward));

    //   _ChallengedSucceeded(challengeID);
    //   if (wasWhitelisted) { _ListingRemoved(_listing); }
    //   else {
    //     _ListingAddedRemoved(_listing); 
    //   }
    // }

    // // Sets flag on challenge being processed
    // challenges[challengeID].resolved = true;

    // // Stores the total tokens used for voting by the winning side for reward purposes
    // challenges[challengeID].totalTokens =
    //   voting.getTotalNumberOfTokensForWinningOption(challengeID);
  }

/**
  @notice             Returns true if listing is whitelisted
  @param _listing     The listing of a user's listing
  */ 
  function isWhitelisted(bytes32 _listing) view public returns (bool whitelisted) {
    return listings[_listing].whitelisted;
  }

/**
  @notice            Returns true if the application/listing has an unresolved challenge
  @param _listing     The listing of a user's listing
  */ 
  function challengeExists(bytes32 _listing) view public returns (bool) {
    // bytes32 listingHash = _listing;
    // uint challengeID = listings[listingHash].challenges[0];

    // return (listings[listingHash].challengeID > 0 && !challenges[challengeID].resolved);
    return true;
  }

  /**
  @dev                Called by updateStatus() if the applicationExpiry date passed without a challenge being made.
  @dev                Called by resolveChallenge() if an application/listing beat a challenge.
  @param _listing      The listing of an application/listing to be whitelisted
  */
  function whitelistApplication(bytes32 _listing) internal {
    bytes32 listingHash = _listing;

    listings[listingHash].whitelisted = true;
  }
}
