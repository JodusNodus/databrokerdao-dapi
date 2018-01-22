pragma solidity ^0.4.11;

import "tokens/eip20/EIP20.sol";


contract Registry {

  // ------
  // EVENTS
  // ------

  event Enlisted(bytes32 listing, uint deposit, string target);
  event Challenged(bytes32 listing, uint deposit, uint challengeID);
  event Unlisted(bytes32 listing);
  event ChallengeApproved(bytes32 listing);
  event ChallengeDenied(bytes32 listing);
  event Increased(bytes32 listing, uint increasedBy, uint newDeposit);
  event Decreased(bytes32 listing, uint decreasedBy, uint newDeposit);

  struct Listing {
    bool whitelisted;       // Should the data appear on the listing or not
    address owner;          // Owner of Listing
    uint stake;             // Number of unlocked tokens with potential risk if challenged
    string target;          // Identifier of the data
    uint challenges;        // Number of unresolved challenges on the listing
    uint[] challengeIDs;    // Array of the different challenge IDs
    uint totalStake;        // Stake with challenged stake added
  }

  struct Challenge {
    address challenger;     // Owner of Challenge
    bool resolved;          // Indication of if challenge is resolved
    uint stake;             // Number of tokens at risk for either party during challenge
    bytes32 listing;        // Listing this challenge was added to
  }

  // Maps listingHashes to associated listing data
  mapping(bytes32 => Listing) public listings;

  // Maps challenges to associated challenge data
  mapping(uint => Challenge) public challenges;

  // Global Variables
  EIP20 token;
  uint currentChallengeID = 0;
  uint MIN_ENLIST_AMOUNT = 10;
  uint MIN_CHALLENGE_AMOUNT = 5;
  uint ADMIN_PERCENTAGE = 10;

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
    require(_stakeAmount >= MIN_ENLIST_AMOUNT);

    // Transfers tokens from user to Registry contract
    require(token.transferFrom(msg.sender, this, _stakeAmount));

    // Add listing to listings
    uint[] memory empty;
    listings[_listing] = Listing({
      whitelisted: true,
      owner: msg.sender,
      stake: _stakeAmount,
      target: _target,
      challenges: 0,
      challengeIDs: empty,
      totalStake: _stakeAmount
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
    require(listing.challenges == 0);

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
  function increase(bytes32 _listing, uint _stakeAmount) external {
    Listing storage listing = listings[_listing];

    require(listing.owner == msg.sender);
    require(token.transferFrom(msg.sender, this, _stakeAmount));

    listing.stake += _stakeAmount;
    listing.totalStake += _stakeAmount;

    Increased(_listing, _stakeAmount, listing.stake);
  }

  /**
  @notice             Allows the owner of a listing to decrease their unstaked deposit.
  @notice             The listing keeps its previous status.
  @param _listing     The listing of a user's application/listing
  @param _stakeAmount The number of ERC20 tokens to decrease a user's unstaked deposit
  */
  function decrease(bytes32 _listing, uint _stakeAmount) external {
    Listing storage listing = listings[_listing];

    require(listing.owner == msg.sender);
    require(_stakeAmount <= listing.stake);
    require(listing.stake - _stakeAmount >= MIN_ENLIST_AMOUNT);
    require(listing.totalStake - _stakeAmount >= MIN_ENLIST_AMOUNT);

    require(token.transfer(msg.sender, _stakeAmount));

    listing.stake -= _stakeAmount;
    listing.totalStake -= _stakeAmount;

    Decreased(_listing, _stakeAmount, listing.stake);
  }

  /**
  @notice             Starts a challenge for a listing.
  @dev                Tokens are taken from the challenger and the data seller's deposit is locked.
  @param _listing     The listing of data.
  @param _stakeAmount The amount the challenger wants to stake.
  */
  function challenge(bytes32 _listing, uint _stakeAmount) external returns (uint challengeID) {
    require(_stakeAmount >= MIN_CHALLENGE_AMOUNT);

    Listing storage listing = listings[_listing];

    // Takes tokens from challenger
    require(token.transferFrom(msg.sender, this, _stakeAmount));

    // Keep track of challenge id
    challengeID = currentChallengeID + 1;
    currentChallengeID = challengeID; 

    // Add challenge to the challenges mapping
    Challenge memory challenge = Challenge({
      challenger: msg.sender,
      stake: _stakeAmount,
      resolved: false,
      listing: _listing
    });
    challenges[challengeID] = challenge;

    // Increase the number of challenges on the right listing
    listing.challenges = listing.challenges + 1;
    // Add challengeID to listing
    listing.challengeIDs.push(challengeID);
    // Add to the totalStake on a listing
    listing.totalStake = listing.totalStake + _stakeAmount;
    
    Challenged(_listing, _stakeAmount, challengeID);
    return challengeID;
  }

   /**
  @notice             Marks a challenge as resolved.
  @notice             Rewards the winner tokens and either whitelists or de-whitelists the listing.
  @param _listing   A listing with a challenge that is to be resolved
  */
  function approveChallenge(bytes32 _listing) external {
    Listing storage listing = listings[_listing];

    uint totalStake = listing.totalStake;
    uint totalChallengesStake = totalStake - listing.stake;

    // Admin (msg.sender) should get 10% of the total sum of all challenge stakes + lising stake
    uint adminShare = totalStake * (ADMIN_PERCENTAGE / 100);
    msg.sender.transfer(adminShare);

    // Challengers should get a percentage of the total sum of all challenge stakes + lising stake
    // equal to their share of the total challenge stake
    // Get all challenges that are unresolved and are linked to this listing, 
    for (uint i = 0; i < listing.challengeIDs.length; i ++) {
      Challenge memory challenge = challenges[listing.challengeIDs[i]];

      // Calculate what's left to divide between the challengers
      uint challengerShare = totalStake - adminShare;
      // Transfer percentage of challenge
      challenge.challenger.transfer(challengerShare * (challenge.stake / totalChallengesStake));
      // Set challenge as resolved
      challenges[listing.challengeIDs[i]].resolved = true;
    }

    // Take stake from listing
    listing.stake = 0;
    listing.totalStake = 0;
    // Blacklist listing
    listing.whitelisted = false;

    // Event
    ChallengeApproved(_listing);
  }

   /**
  @notice             Marks a challenge as denied.
  @notice             Rewards the listing seller tokens and de-whitelists the listing.
  @param _listing     A listing with a challenge that is to be resolved
  */
  function denyChallenge(bytes32 _listing) external {
    Listing storage listing = listings[_listing];

    // Get all challenges that are unresolved and are linked to this listing
    
    // Sum up all stakes for the challenges
    // Admin should get 10% of the total challenge stake
    // The remaining 90% should go to the data seller
  }

  /**
  @dev      Withdraw all the fund from this contract
  */
  function withdraw() public {
    // uint amount = pendingWithdrawals[msg.sender];
    // // Remember to zero the pending refund before
    // // sending to prevent re-entrancy attacks
    // pendingWithdrawals[msg.sender] = 0;
    // msg.sender.transfer(amount);
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
  function challengeExists(bytes32 _listing) view public returns (bool exists) {
    return (listings[_listing].challenges > 0);
  }

  /**
  @dev                Called by updateStatus() if the applicationExpiry date passed without a challenge being made.
  @dev                Called by resolveChallenge() if an application/listing beat a challenge.
  @param _listing      The listing of an application/listing to be whitelisted
  */
  function whitelistApplication(bytes32 _listing) internal {
    listings[_listing].whitelisted = true;
  }
}
