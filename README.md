# DataBroker DAO distributed API

In short, DataBroker DAO is a decentralised marketplace for IoT sensor data, built on Blockchain technology. To learn more about the platform in its entirety, please check out the [whitepaper](https://databrokerdao.com/whitepaper/WHITEPAPER_DataBrokerDAO_en.pdf).

This documentation covers the distributed API to communicate with the (ethereum based) blockchain that drives DataBroker DAO.

## Token curated registry

A token curated registry (TCR):

1.  Lists something
2.  Appearance/sorting index/… on the list is determined by everyone in the system

In practice, a certain amount of tokens (a **stake**) has to be paid to enlist something in the registry. The higher the stake, the higher the guarantee that what you put in the registry is of sound quality. Some TCRs implement a voting system, where a certain amount of users needs to vote that the (potential) listing is sound before it appears publicly in the registry. Some use a challenging system, where users can challenge a listing, paying a stake to guarantee their claim is sound. For DataBroker DAO, we chose for the second approach, because that way a new listing can appear quickly (no waiting for approval by enough users within the system), and users are still granted the opportunity to challenge a bad listing.

### The DataBroker DAO approach

#### Adding data

When a sensor owner wants to add new data to the marketplace, he will have to pay a certain amount in tokens (a stake) to be listed in the registry at all. Data sellers can stake more DTX tokens if they want to, because staking more allows the listed sensors/sets to appear more prominently in the listings (e.g., sorting, or additional badges in the interface). This improves the chances of the data being bought, and at the same increases the guarantees a buyer has that the data is of good quality and contains the advertised information.

#### Challenging data

A data buyer that is unhappy with the quality of data can challenge an entry in the registry by staking some DTX tokens. This challenge will be represented in the UI to all potential buyers as a negative reputation score. In itself, it does not have any effect on selling of the data. Upon reaching a certain threshold of challenges, a check of the data provider will be performed by a DataBroker DAO administrator. Upon finding issues with the advertised data, its stake is distributed equally over all challengers and the DataBroker DAO platform wallet, and the entry is removed from the registry. If it is deemed that the data is sound, the staked tokens by the challengers get distributed to the data seller and the platform. This incentivizes data sellers to maintain a good standing and delivering data as advertised.

Data buyers are encouraged to report bad data to recoup the lost funds due to bad data, and discouraged from reporting false challenges. The seller can reduce lost funds due to unfair bad reputation. The DataBroker DAO platform and its administrators are encouraged to handle these disputes quickly and efficiently and are rewarded for their time and effort.



## Authentication

The DataBroker DAO dAPI is secured by a traditional JWT-token. This token contains your identification for both the API and the underlying blockchain. The API will respond with a `402` error if your account is not authorised to use this application. You will reveive an API key from SettleMint on completion of the license agreement. An example for such a key is `0xa6d270804d92dbc5eb659eade7a46f1d8227bae9c4bbec3a1c61312827283024`.

Using the `authenticate` endpoint, this key needs to be converted to a JWT token.

```bash
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ \
   "privateKeys": { \
     "ethereum": "0xa6d270804d92dbc5eb659eade7a46f1d8227bae9c4bbec3a1c61312827283024" \
   }, \
   "encrypted": false \
 }' 'http://localhost:3333/authenticate'
```

The result is the token that you will need for any anchor call to the API:

```json
{
  "token":
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldGhlcmV1bSI6IjA0OWI3MWExMDgzMDExZmIwZmU4ZGIwYzE2NDcyNGQzZGFkOWZiYjliNGE0NDBiZGM5NDkyNzg0YTQ5NzZlODgyMTJkYWUyMDFlMjIwODc5ZjcwZmQ5YTgyOWQwMWQxOTk2MjUyZmFhMWE5Y2NmY2UwYmYxNTMyMzAyMzlmZmRiNWUwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDJkYjFhOTI1NmMxZDM5M2RkOTNhYWU3MzIzYWU2NWFhY2Y3MDZmNThjNWQwZTAxZTg5YzM5OTYwMDZhYTFhMzlhNjQ3NDk5NjliMTViNmQwMzNiOThhOTZkOWM0NjhlNmRiM2M0OTBmMGE4ODJmN2MzZWFmNTgyYTNjZjU1OTY5IiwiaWF0IjoxNTE5MDYxODkwfQ.-KtgkKQyN7AP2I4sdjOwjj7T2jyioFDWnqQ0m31d7a8"
}
```

This token will need to be passed along in the `Authorization` header like so: (adjust for your own API call framework)

```bash
curl -X POST \
     --header 'Content-Type: application/json' \
     --header 'Accept: application/json' \
     --header 'Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJldGhlcmV1bSI6IjA0OWI3MWExMDgzMDExZmIwZmU4ZGIwYzE2NDcyNGQzZGFkOWZiYjliNGE0NDBiZGM5NDkyNzg0YTQ5NzZlODgyMTJkYWUyMDFlMjIwODc5ZjcwZmQ5YTgyOWQwMWQxOTk2MjUyZmFhMWE5Y2NmY2UwYmYxNTMyMzAyMzlmZmRiNWUwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDJkYjFhOTI1NmMxZDM5M2RkOTNhYWU3MzIzYWU2NWFhY2Y3MDZmNThjNWQwZTAxZTg5YzM5OTYwMDZhYTFhMzlhNjQ3NDk5NjliMTViNmQwMzNiOThhOTZkOWM0NjhlNmRiM2M0OTBmMGE4ODJmN2MzZWFmNTgyYTNjZjU1OTY5IiwiaWF0IjoxNTE5MDYxODkwfQ.-KtgkKQyN7AP2I4sdjOwjj7T2jyioFDWnqQ0m31d7a8' \
     -d '{ "data": ["fddb948c5b6a26015197afd1b42626c53e5cfa464bd879439030ea16aca1edd0","9ebb8a0a4d842223c9e377ccc01718d99f00b8a63f6425d21a09c15ef54f39fa"]}' \
   'http://localhost:3333/anchor'
```

## Minting tokens

Users can (for now) mint demo DTX tokens for themselves.

`POST /dtxminter/mint`

Expects the following parameters:

* amount: uint, amount of DTX tokens to mint

## Before transfering tokens

Before calling a method on a contract that transfers tokens (f.e. enlist, increase, challenge, …), you need to **approve** the amount of tokens first. Basically, approving means giving another contract the right to spend your tokens.

`POST /dtxtoken/[token address]/approve`

Expects the following parameters:

* spender: address of the contract (of which you call the method) that will be paying the DTX tokens for you
* value: uint, number of DTX tokens that need to be transferred

#### Example

Before doing an enlist call on the sensorRegistry contract, you need to approve the stakeamount you are passing in the enlist call, because that amount of tokens will be transferred from the user calling the contract (msg.sender) to the sensorRegistry.

```bash
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ \
   "spender": "0x254353243235525352533", \
   "value": "10" \
 }' 'http://localhost:3333/dtxtoken/0x1212314414123123133/approve'
```

* address in the url is the address of the deployed token contract. You can find this by calling `GET /dtxtokenregistry/list`. You will get a response like this, the token address can be found in `items[0].contractAddress`:

  ```
  {
    "base": {
      "_id": "5aa0f522ab5e7d0010c76778",
      "originContractName": "DtxTokenRegistry",
      "originContractAddress": "0xb75b3cf0c971abc04e00432c40b231e4328ddfe5",
      "key": "0xb75b3cf0c971abc04e00432c40b231e4328ddfe5",
      "metadata": "",
      "gatekeeper": "0x114b2b7298dcf079c7a2bd9cf16fa29f3acbdfbc",
      "listtokenrole": "LIST_TOKEN_ROLE",
      "updatemetadatarole": "UPDATE_METADATA_ROLE"
    },
    "synced": true,
    "total": 1,
    "items": [
      {
        "_id": "5aa0f523ab5e7d0010c7677d",
        "originContractName": "DtxTokenRegistry",
        "originContractAddress": "0xb75b3cf0c971abc04e00432c40b231e4328ddfe5",
        "key": "DTX",
        "contractaddress": "0x469f06830d0841c82944408711b1af1b6e5fd1d0", // Token address
        "name": "DTX",
        "totalsupply": "10000001000",
        "decimals": "18",
        "metadata": "",
        "gatekeeper": "0x114b2b7298dcf079c7a2bd9cf16fa29f3acbdfbc",
        "burnrole": "BURN_ROLE",
        "mintrole": "MINT_ROLE",
        "updatemetadatarole": "UPDATE_METADATA_ROLE",
        "subContractName": "DtxToken"
      }
    ]
  }
  ```

* spender is the address of the contract that will spend the tokens in your name, in this example the sensorRegistry Dispatcher contract. (See the upgradeable contracts section below for more info) You can find the address by calling `GET /sensorregistrydispatcher/target`, the sensorRegistry address can be found in `target`. This address will change when the registry is updated, so it's important to get it in a dynamic way and not hardcode it.

* value is the amount of DTX that will be spent, for the enlist call that is the amount that will be passed in the `stakeamount`property.



## Upgradeable contracts

One of the major differences between blockchain applications and tradional ones, is the immutability of the contracts deployed on the chain. Once a contract is deployed, it can **never** be changed again. That is a good thing, but can cause a lot of problems: how do you fix a bug? How do you implement a new feature? To solve this, we've been looking for a way to be able to upgrade Ethereum smart contracts, without their storage and state being lost.

For our solution, we found inspiration in [Arachnid's Upgradeable.sol contract](https://gist.github.com/Arachnid/4ca9da48d51e23e5cfe0f0e14dd6318f). However, Arachnid uses an initialize method that we replaced by using the assembly code from [Maroaz's Dispatcher.sol contract](https://github.com/maraoz/solidity-proxy/blob/master/contracts/Dispatcher.sol)

The structure looks like this:

```mermaid
graph LR
    A(Dispatcher) --> B[ExampleDispatcher]
    E(Upgradeable) --> A(Dispatcher)
    B[ExampleDispatcher] --> D[Example1]
    E(Upgradeable) --> D[Example1]
    F[IExample] --> D[Example1]
    B[ExampleDispatcher] --> G[Example2]
    E(Upgradeable) --> G[Example2]
    F[IExample] --> G[Example2]
```

The Upgradable contract is generic, as is the Dispatcher contract. For each contract that needs to become upgradeable, you need to create a specific Dispatcher, that extends the generic Dispatcher. This is needed because a Dispatcher can only work when it has the same storage scheme as the underlying contract. This means that **the storage scheme of a smart contract cannot be upgraded**.

### Create an upgradeable contract

- create a contract and **make sure it extends Upgradeable**:

  ```javascript
  import "@settlemint/solidity-mint/contracts/utility/upgrading/Upgradeable.sol";
  
  /* Contract interface */
  contract ISimpleExample {
    function getUint() public returns (uint);
  }
  
  /* Contract */
  contract SimpleExample is ISimpleExample, Upgradeable { 
    function SimpleExample(address gatekeeper) Secured(gatekeeper) public {}
  
    function getUint() public returns (uint) {
      return 10;
    }
  }
  ```

- create a custom dispatcher with the same storage scheme as the contract, and **make sure it extends Dispatcher**:

  ```javascript
  import "@settlemint/solidity-mint/contracts/utility/upgrading/Dispatcher.sol";
  
  contract SimpleExampleDispatcher is Dispatcher {
    function SimpleExampleDispatcher(address gatekeeper)
      Secured(gatekeeper)
      public
    {}
  }
  ```

- make sure your wallet has the proper permission:

  ```javascript
  const dispatcher = SimpleExampleDispatcher.new(gatekeeper.address)
  
  const role = await dispatcher['UPGRADE_CONTRACT'].call() 
  await gateKeeper.createPermission(
     accounts[0], // Your wallet
     dispatcher.address, // Dispatcher contract will need the permission
     role,
     accounts[0] // Permission manager, can be any wallet, but preferably an admin one
  )
  ```

- calls the `setTarget` method on the custom dispatcher:

  ```javascript
  const contract = new SimpleExample.new(gatekeeper.address)
  dispatcher.setTarget(contract.address)
  ```

- dispatcher address is now the address of the contract, if you need to refer to it

  ​

### Upgrade and upgradeable contract

- create a new contract: 

  ```javascript
  contract NewSimpleExample is ISimpleExample, Upgradeable { 
    function NewSimpleExample(address gatekeeper) Secured(gatekeeper) public {}
  
    function getUint() public returns (uint) {
      return 1; // Update: returns 1 in stead of 10
    }
  }
  ```

- call the `setTarget` method in the custom dispatcher with the new contract's address:

  ```javascript
  const newContract = new NewSimpleExample.new(gatekeeper.address)
  dispatcher.setTarget(newContract.address)
  ```

- to call the contract, you still use the dispatcher address, but the dispatcher will call the new contract internally



## Domain

The domain consists of three main parts:

* **Sensor**: represents one IoT sensor/piece of data that is for sale on the platform. These sensors are listed in a token curated registry called the SensorRegistry.
* **Challenge**: represents a challenge on a sensor, and is listed on that sensor.
* **Purchase**: represents a purchase of a sensor, by a user for a certain amount of time. Purchases are listed in the PurchaseRegistry

## Sensors

Sensors can have two different types (for now):

* **Stream**: represents a sensor that streams data at a certain interval. Buyers of a stream buy access to the new data that is **pushed** automatically to a webhook in the DataBroker DAO backend and then transferred to the buyers who have access at that moment. Example: a sensor that measures air quality in Leuven, BE, and pushes a reading every day.
* **Dataset**: represents a sensor or other kind of data is a fixed format. The buyers buys this set, or buys access to this set for a certain amount of time, but the DataBroker DAO system **pulls** the data when the buyer requests it. Example: an excel sheet with all the readings of an air quality sensor in Leuven, BE, between March 1st and May 1st 2018.

### Enlist a new sensor

When enlisting a sensor, you want to enlist some metadata too.

`POST /ipfs/add/json` with the following body (JSON.stringify if necessary):

```
data: {
    name: 'Temperature outside Bar Berlin',
    geo: {
        lat: 50.880722,
        lng: 4.692725,
    },
    sensortype: 'temperature', // the type of the sensor itself
    datatype: 'stream', // can be stream or dataset
    example: "{'value':11,'unit':'celsius'}",
    updateinterval: 60000,
}
```

A succesful response returns a hash property, which you can use in the enlist call.

`POST /sensorregistrydispatcher/enlist`

Expects the following parameters:

* stakeamount: uint, amount of DTX the owner of the sensor want to stake. Minimum of 10 DTX for now.
* price: uint, amount of DTX needed to purchase access to **one second** of this sensor.
* metadata: hash property you get back from `POST /ipfs/add/json`

​

### Unlist a sensor

Only the **owner of the sensor** can unlist it. Sensor can only be unlisted when it's **whitelisted** and has **no challenges** ongoing.

`POST /sensorregistrydispatcher/unlist`

Expects the following parameters:

* sensor: address of the sensor contract.

### Increase sensor stake

Only the **owner of the sensor** can increase the stake.

`POST /sensorregistrydispatcher/increase`

Expects the following parameters:

* sensor: address of the sensor contract.
* stakeamount: uint, amount of DTX that need to be added to the current stake.

### Decrease sensor stake

Only the **owner of the sensor** can decrease the stake. Stake can not be decreased below the minimum stake amount of 10 DTX.

`POST /sensorregistrydispatcher/decrease`

Expects the following parameters:

* sensor: address of the sensor contract.
* stakeamount: uint, amount of DTX that need to be subtracted from the current stake.

### Search for sensors

Queries the MongoDB collection where sensors have been saved.

`GET /sensorregistrydispatcher/list`

Expects the following query parameters:

* limit: uint, max number of sensors to return (useful for pagination).
* skip: uint, skip to index (useful for pagination).
* sort: string, parameter on which to sort (useful for pagination).
* dir: string, sort direction, desc or asc (useful for pagination).

You can also add custom Mongo query parameters like this: `&name=test`(see [https://github.com/settlemint/lib-ethereum/blob/master/src/utils/ParseMongoQueryString.js](https://github.com/settlemint/lib-ethereum/blob/master/src/utils/ParseMongoQueryString.js) for documentation)

The response looks like this:

```
{
 “base”: {
   “_id”: “5a9eb5b2069f7500164c2c1f”,
   “originContractName”: “SensorRegistry”,
   “originContractAddress”: “0x66de1793a8f30b855d4c4555fb032f12b3aa4ea3”,
   “key”: “0x66de1793a8f30b855d4c4555fb032f12b3aa4ea3”,
   “withdrawfundsrole”: “WITHDRAW_FUNDS_ROLE”,
   “curatechallengerole”: “CURATE_CHALLENGE_ROLE”,
   “gatekeeper”: “0xd8d085290d1f24bde8826dbcd62c0f79d75dc90d”,
   “token”: “0x4a958cd3d99112f4a0a6545d52bb377bdca3b561”,
   “listingfactory”: “0xbba3bc3d839e6bd8800930079e7482937db21bdf”
 },
 “synced”: true,
 “total”: 1,
 “items”: [
   {
     “_id”: “5a9eb5b3069f7500164c2c21",
     “originContractName”: “SensorRegistry”,
     “originContractAddress”: “0x66de1793a8f30b855d4c4555fb032f12b3aa4ea3",
     “key”: “0x66de1793a8f30b855d4c4555fb032f12b3aa4ea3",
     “contractaddress”: “0x134b15a44838a23011d798c477422045da46f16b”, // address of the sensor contract (needed for other calls)
     “challenges”: “0", // Number of challenges that are currently raised on this sensor
     “metadata”: “QmbtwxUSc4TMbZLWkLfPHw6QT5ZTgD9JztiGTSdk9Zkry1",
     “name”: “Temperature outside Bar Berlin”,
     “geo”: {
       “lat”: 50.880722,
       “lng”: 4.692725
     },
     “type”: “temperature”,
     “example”: “{‘value’:11,‘unit’:‘celsius’}“,
     “updateinterval”: 60000,
     “stake”: “10”,
     “whitelisted”: true, // whether or not the sensor can be shown: if true, show
     “gatekeeper”: “0xd8d085290d1f24bde8826dbcd62c0f79d75dc90d”,
     “challengesstake”: “0", // total stake in DTX from challenges
     “owner”: “0x31401412f6902e0cd41822eeced276c80134e916",
     “price”: “10", // Price per second
     “updatemetadatarole”: “UPDATE_METADATA_ROLE”,
     “subContractName”: “Sensor”
   }
 ]
}
```

### Change settings

There are a few settings that can be changed on the sensor registry:

* **minimum enlist amount**. This is the minimum amount in DTX a sensor owner has to lock-up when enlisting.
* **minimum challenge amount**. This is the minimum amount in DTX a sensor buyer has to locku-up when he wants to raise a challenge.
* **curator percentage**. This is the percentage of the sum of the challenges on a listing that goes to a DataBroker DAO curator, represented as whole number: 1% is represented by 1.

Settings can only be changed by **users with the CHANGE_SETTINGS_ROLE**. In development and staging, this is the admin0 user.

#### setMinEnlistAmount

`POST /sensorregistrydispatcher/setminenlistamount`

Expects the following parameters:

* amount: uint, the new amount in DTX

#### setMinChallengeAmount

`POST /sensorregistrydispatcher/setminchallengeamount`

Expects the following parameters:

* amount: uint, the new amount in DTX

#### setCuratorPercentage

`POST /sensorregistrydispatcher/setcuratorpercentage`

Expects the following parameters:

* amount: uint, the new percentage (as a whole number)

## Purchasing

### Purchasing access to a sensor

* When enlisting a sensor, you want to enlist some metadata too.

  `POST /ipfs/add/json` with the following body (JSON.stringify if necessary):

  ```
  data: {
      email: "silke@databrokerdao.com"
  }
  ```

  A succesful response returns a hash property, which you can use in the enlist call.

* Before purchasing, we need to approve the token amount (see [Before transfering tokens](?id=before-transfering-tokens))
  Make sure the amount you approve is >= the price the buyer will have to pay: **seconds from now to endtime \* sensor price**. You can use something like following algorithm to predict the amount: `sensorPrice * (endtime - (new Date().getTime() / 1000)) + 1000`. The 1000 seconds added at the end are a safety measure, to make sure the approved amount is high enough.

* `POST /purchaseregistrydispatcher/purchaseaccess`

  Expects the following parameters:

  * sensor: address,
  * endtime: uint, unix (= in seconds) timestamp of time when the user should lose access.
  * metadata: hash property you get back from `POST /ipfs/add/json`

### Search for purchases

Queries the MongoDB collection where sensors have been saved.

`GET /purchaseregistrydispatcher/list`

Expects the following query parameters:

* limit: uint, max number of sensors to return (useful for pagination).
* skip: uint, skip to index (useful for pagination).
* sort: string, parameter on which to sort (useful for pagination).
* dir: string, sort direction, desc or asc (useful for pagination).

You can also add custom Mongo query parameters like this: `&name=test`(see [https://github.com/settlemint/lib-ethereum/blob/master/src/utils/ParseMongoQueryString.js](https://github.com/settlemint/lib-ethereum/blob/master/src/utils/ParseMongoQueryString.js) for documentation)

The response looks like this:

```
{
  "base": {
    "_id": "5aaf7d1c63191900104cca1e",
    "originContractName": "PurchaseRegistry",
    "originContractAddress": "0xedeb346c47918a27344f6d915f7d72f16eefa120",
    "key": "0xedeb346c47918a27344f6d915f7d72f16eefa120",
    "createpermissionsrole": "CREATE_PERMISSIONS_ROLE",
    "gatekeeper": "0xf56c9e5c364066d9f7412245126f299a8fcb5c41",
    "token": "0x9ea562b898566c36dc5ff18ade4f69ae56e70dfb"
  },
  "synced": false,
  "total": 1,
  "items": [
    {
      "_id": "5aaf7d1d63191900104cca20",
      "originContractName": "PurchaseRegistry",
      "originContractAddress": "0xedeb346c47918a27344f6d915f7d72f16eefa120",
      "key": "0xc804dd3be595816031f393f63dc49d3a698f7dab",
      "contractaddress": "0xc804dd3be595816031f393f63dc49d3a698f7dab", // Address of the purchase
      "endtime": "1521450312", // Timestamp (Unix, in seconds) of when the user will lose access to the sensor
      "metadata": "QmPkE6jz62JHia3YkV9vE8FTHmUSsHHJigrk5w8N4XTuGp",
      "email": "silke@databrokerdao.com", // Email address that needs to get sensor updates
      "gatekeeper": "0xf56c9e5c364066d9f7412245126f299a8fcb5c41",
      "purchaser": "0x1b777c767e9f787ec3575ef15261b5691b0c9ffc",
      "sensor": "0xdb4337a1530427dec7d2db5c82181a48accf1155", // Address of the purchased sensor: you might need to query on this to only get the purchases for a certain sensor
      "starttime": "1521450251",
      "price": "10", // Price per second
      "updatemetadatarole": "UPDATE_METADATA_ROLE",
      "subContractName": "Purchase"
    }
  ]
}
```

### Change settings

The only setting on purchasing that can be changed is **sale percentage**. This is the percentage of each sale that goes to DataBroker DAO, represented as whole number: 1% is represented by 1.

Settings can only be changed by **users with the CHANGE_SETTINGS_ROLE**. In development and staging, this is the admin0 user.

#### setSalePercentage

`POST /purchaseregistrydispatcher/setsalepercentage`

Expects the following parameters:

* amount: uint, the new percentage (as a whole number)

## Challenges

### Challenge a sensor

Before raising a challenge, create an IPFS hash of the reason for this challenge:

`POST /ipfs/add/json` with the following body (JSON.stringify if necessary):

```
data: {
    reason: 'The data is really really bad'
}
```

A succesful response returns a hash property, which you can use in the challenge call.

`POST /sensorregistrydispatcher/challenge`

Expects the following parameters:

* listing: address of the sensor contract.
* stakeamount: uint, amount of DTX that need to staked. Minimum stake amount of 5 DTX.
* metadata: hash property of the IPFS call.

### Search for challenges

Challenges are listed in the ChallengeRegistry. To get a list of challenges:

`GET /challengeregistrydispatcher/list`

Expects the following parameters:

* limit: uint, max number of sensors to return (useful for pagination).
* skip: uint, skip to index (useful for pagination).
* sort: string, parameter on which to sort (useful for pagination).
* dir: string, sort direction, desc or asc (useful for pagination).

You can also add custom Mongo query parameters like this: `&listing=0xe530bf5b85a224d1e57bcb1114c9e214f28a1888`(see [https://github.com/settlemint/lib-ethereum/blob/master/src/utils/ParseMongoQueryString.js](https://github.com/settlemint/lib-ethereum/blob/master/src/utils/ParseMongoQueryString.js) for documentation)

The response looks somewhat like this:

```
{
  "base": {
    "base": {
    "_id": "5ae18f98bf14e600104a0874",
    "originContractName": "ChallengeRegistry",
    "originContractAddress": "0x433363e6863a9eaad6df8010de3e5a8391cd0c25",
    "key": "0x433363e6863a9eaad6df8010de3e5a8391cd0c25",
    "gatekeeper": "0xa25b984a40a8520c3862084c9edc47ef3ff04f6d"
  },
  "synced": false,
  "total": 0,
  "items": [ // all the challenges on all sensors: ALSO THE ONES THAT WERE RESOLVED
    {
      "_id": "5acf6326429a430010ac50b7",
      "originContractName": "Sensor",
      "originContractAddress": "0xe530bf5b85a224d1e57bcb1114c9e214f28a1888",
      "key": "0xd43b60fdc4e3c746d78fb56c68a87a92f0a8240a",
      "contractaddress": "0xd43b60fdc4e3c746d78fb56c68a87a92f0a8240a", // address of the challenge
      "metadata": "QmavgN3LyWRndkVgB3gtJTCCSJYzpZ6ub7BNmyM3yUo8GE",
      "reason": "this data is baaaaaaad",
      "stake": "5",
      "resolved": false, // whether or not the challenge has been denied/approved
      "gatekeeper": "0x6a53dda54f8b3324f2e51eb4d05fca648121f65a",
      "challenger": "0x99ab97de6b00bdef5a39bd4b11934d32c595dc9f",
      "timestamp": "1523540772",
      "listing": "0xe530bf5b85a224d1e57bcb1114c9e214f28a1888",
      "updatemetadatarole": "UPDATE_METADATA_ROLE",
      "subContractName": "Challenge"
    }
  ]
}
```

### Approve challenge on a sensor

**Only admins** can approve a challenge. When a challenge is approved, 10% of the total challenge stake goes to the admin approving it. The rest of the sum of the challenges stakes and the enlist stake of the sensor is divided among the challengers, according to how much their challenge makes up of the total challenged stake.

`POST /sensorregistrydispatcher/approvechallenge`

Expects the following parameters:

* listing: address of the sensor contract.

### Deny challenge on a sensor

**Only admins** can deny a challenge. When a challenge is denied, 10% of the total challenge stake goes to the admin denying it. The rest of the sum of the challenges stakes and the enlist stake of the sensor is transferred to the sensor owner.

`POST /sensorregistrydispatcher/denychallenge`

Expects the following parameters:

* listing: address of the sensor contract.

  ​

## Deploying

### Staging

To deploy to staging, we first need to **deploy the smart contracts**. There is a shell script that takes care of that for us called `deploy.staging.sh`:

```
sh deploy.staging.sh
```

Then, commit the changes to the json files in `build/contracts` with a commit message using either `fix:`(semantic patch release) or `feat:` (semantic minor release), and push to **master**.

Check Travis ([https://travis-ci.org/DataBrokerDAO/databrokerdao-dapi](https://travis-ci.org/DataBrokerDAO/databrokerdao-dapi)) for build progress. Once the build is ready, Travis will push to DockerHub [https://hub.docker.com/r/settlemint/databrokerdao-dapi/](https://hub.docker.com/r/settlemint/databrokerdao-dapi/), DockerHub will call a webhook on Rancher to upgrade the databrokerdao-staging/databrokerdao-dapi service.

## MintNet

The blockchain network underlying this system is Ethereum, using a Proof-of-Authority consensus engine. Proof-of-Authority is a replacement for Proof-of-Work and is well suited for consortium and semi-public chain setups as it does not depend on nodes solving arbitrarily complex mathematical problems, but instead uses a set of "authorities" - nodes that are explicitly allowed to create new blocks and secure the blockchain. A Poof-of-Authority chain has to be signed off by the majority of authorities and when this is done, the record is permanently committed and recorded.

In a consortium setting, there are only advantages to using a Proof-of-Authority network. It is more secure than a small Proof-of-Work network since an attacker who gains unwanted connection or who has hacked an authority cannot overwhelm the network to modify or revert transaction. It is less computationally intensive, more performant and more predictable.

![MintNet Statistics](./mintnetstats.png)

MintNet is such a semi-public network. It has been configured in such a way that transaction costs (gas) that are associated with Ethereum transactions are removed and blocks are created in 5 second intervals. This eliminates the need for complex steps to fund wallets prior to executing a transaction on the network and it prevents having to deal with the unstable cryptocurrency exchange rates. More statistics on [https://stats.mintnet.settlemint.com](https://stats.mintnet.settlemint.com)

![MintNet Explorer](./mintnetexplorer.png)

On top of this network, a publicly available blockchain explorer is available at [https://explorer.mintnet.settlemint.com](https://explorer.mintnet.settlemint.com). Using this explorer, anyone can independently validate the content of the transactions.

If you want to run your own node on MintNet and or run the API on premise, contact [hello@settlemint.com](mailto:hello@settlemint.com).
