# DataBroker DAO distributed API

In short, DataBroker DAO is a decentralised marketplace for IoT sensor data, built on Blockchain technology. To learn more about the platform in its entirety, please check out the [whitepaper](https://databrokerdao.com/whitepaper/WHITEPAPER_DataBrokerDAO_en.pdf). 

This documentation covers the distributed API to communicate with the (ethereum based) blockchain that drives DataBroker DAO.

## Token curated registry

A token curated registry (TCR):

1. Lists something
2. Appearance/sorting index/… on the list is determined by everyone in the system

In practice, a certain amount of tokens (a **stake**) has to be paid to enlist something in the registry. The higher the stake, the higher the guarantee that what you put in the registry is of sound quality. Some TCRs implement a voting system, where a certain amount of users needs to vote that the (potential) listing is sound before it appears publicly in the registry. Some use a challenging system, where users can challenge a listing, paying a stake to guarantee their claim is sound. For DataBroker DAO, we chose for the second approach, because that way a new listing can appear quickly (no waiting for approval by enough users within the system), and users are still granted the opportunity to challenge a bad listing.

### The DataBroker DAO approach

#### Adding data

When a sensor owner wants to add new data to the marketplace, he will have to pay a certain amount in tokens (a stake) to be listed in the registry at all. Data sellers can stake more DTX tokens if they want to, because staking more allows the listed streams/sets to appear more prominently in the listings (e.g., sorting, or additional badges in the interface). This improves the chances of the data being bought, and at the same increases the guarantees a buyer has that the data is of good quality and contains the advertised information.

#### Challenging data

A data buyer that is unhappy with the quality of data can challenge an entry in the registry by staking some DTX tokens. This challenge will be represented in the UI to all potential buyers as a negative reputation score. In itself, it does not have any effect on selling of the data. Upon reaching a certain threshold of challenges, a check of the data provider will be performed by a DataBroker DAO administrator. Upon finding issues with the advertised data, its stake is distributed equally over all challengers and the DataBroker DAO platform wallet, and the entry is removed from the registry. If it is deemed that the data is sound, the staked tokens by the challengers get distributed to the data seller and the platform. This incentivizes data sellers to maintain a good standing and delivering data as advertised. 

Data buyers are encouraged to report bad data to recoup the lost funds due to bad data, and discouraged from reporting false challenges. The seller can reduce lost funds due to unfair bad reputation. The DataBroker DAO platform and its administrators are encouraged to handle these disputes quickly and efficiently and are rewarded for their time and effort.



## Pushing sensor data to subscribers

When a user has successfully purchased access to a certain sensor stream, the following happens.

1. The system monitoring the stream (outside of DataBroker DAO) receives a new sensor reading.
2. The system calls a DataBroker DAO dAPI endpoint which:
   * Checks which users have a subscription for this stream at this moment.
   * Pushes the reading to the preferred storage mechanism of the subscribers (f.e. Dropbox, AWS S3, …).



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

- spender: address of the contract (of which you call the method) that will be paying the DTX tokens for you
- value: uint, number of DTX tokens that need to be transferred




#### Example

Before doing an enlist call on the streamRegistry contract, you need to approve the stakeamount you are passing in the enlist call, because that amount of tokens will be transferred from the user calling the contract (msg.sender) to the streamRegistry.

````bash
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ \
   "spender": "0x254353243235525352533", \
   "value": "10" \
 }' 'http://localhost:3333/dtxtoken/0x1212314414123123133/approve'
````

* address in the url is the address of the deployed token contract. You can find this by calling `GET /dtxtokenregistry/list`. You will get a response like this, the token address can be found in `items[0].contractAddress`: 

  ````
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
  ````

* spender is the address of the contract that will spend the tokens in your name, in this example the streamRegistry contract. You can find the address by calling `GET /streamregistry/list`, the streamRegistry address can be found in `base.key`.

* value is the amount of DTX that will be spent, for the enlist call that is the amount that will be passed in the `stakeamount`property.




## Streams

For now, DataBroker DAO only works with streams. In the future, datasets will be available too.



### Enlist a new stream

When enlisting a stream, you want to enlist some metadata too. 

`POST /ipfs/add/json` with the following body (JSON.stringify if necessary): 

````
data: {
    name: 'Temperature outside Bar Berlin',
    geo: {
        lat: 50.880722,
        lng: 4.692725,
    },
    type: 'temperature',
    example: "{'value':11,'unit':'celsius'}",
    updateinterval: 60000,
}
````

A succesful response returns a hash property, which you can use in the enlist call.



`POST /streamregistry/enlist`

Expects the following parameters: 

* stakeamount: uint, amount of DTX the owner of the stream want to stake. Minimum of 10 DTX for now.
* price: uint, amount of DTX needed to purchase access to **one second** of this stream.
* metadata: hash property you get back from `POST /ipfs/add/json` 


​


### Unlist a stream

Only the **owner of the stream** can unlist it. Stream can only be unlisted when it's **whitelisted** and has **no challenges** ongoing.

 `POST /streamregistry/unlist`

Expects the following parameters: 

- stream: address of the stream contract. 




### Increase stream stake

Only the **owner of the stream** can increase the stake. 

 `POST /streamregistry/increase`

Expects the following parameters: 

- stream: address of the stream contract. 
- stakeamount: uint, amount of DTX that need to be added to the current stake.




### Decrease stream stake

Only the **owner of the stream** can decrease the stake. Stake can not be decreased below the minimum stake amount of 10 DTX.

`POST /streamregistry/decrease`

Expects the following parameters: 

- stream: address of the stream contract. 
- stakeamount: uint, amount of DTX that need to be subtracted from the current stake.




### Search for streams

Queries the MongoDB collection where streams have been saved.

`GET /streamregistry/list`

Expects the following query parameters: 

- limit: uint, max number of streams to return (useful for pagination).
- skip: uint, skip to index (useful for pagination).
- sort: string, parameter on which to sort (useful for pagination).
- dir: string, sort direction, desc or asc (useful for pagination).

You can also add custom Mongo query parameters like this: `&name=test`(see [https://github.com/settlemint/lib-ethereum/blob/master/src/utils/ParseMongoQueryString.js](https://github.com/settlemint/lib-ethereum/blob/master/src/utils/ParseMongoQueryString.js) for documentation)

The response looks like this: 

````
{
 “base”: {
   “_id”: “5a9eb5b2069f7500164c2c1f”,
   “originContractName”: “StreamRegistry”,
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
     “originContractName”: “StreamRegistry”,
     “originContractAddress”: “0x66de1793a8f30b855d4c4555fb032f12b3aa4ea3",
     “key”: “0x66de1793a8f30b855d4c4555fb032f12b3aa4ea3",
     “contractaddress”: “0x134b15a44838a23011d798c477422045da46f16b”, // address of the stream contract (needed for other calls)
     “challenges”: “0", // Number of challenges that are currently raised on this stream
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
     “whitelisted”: true, // whether or not the stream can be shown: if true, show
     “gatekeeper”: “0xd8d085290d1f24bde8826dbcd62c0f79d75dc90d”,
     “challengesstake”: “0", // total stake in DTX from challenges
     “owner”: “0x31401412f6902e0cd41822eeced276c80134e916",
     “price”: “10", // Price per second
     “updatemetadatarole”: “UPDATE_METADATA_ROLE”,
     “subContractName”: “Stream”
   }
 ]
}
````





### Get one stream

Queries the MongoDB collection where streams have been saved.

`GET /streamregistry/list/[stream address]`





## Challenges



### Challenge a stream

 `POST /streamregistry/challenge`

Expects the following parameters: 

- listing: address of the stream contract. 
- stakeamount: uint, amount of DTX that need to staked. Minimum stake amount of 5 DTX.




### Approve challenge on a stream

**Only admins** can approve a challenge. When a challenge is approved, 10% of the total challenge stake goes to the admin approving it. The rest of the sum of the challenges stakes and the enlist stake of the stream is divided among the challengers, according to how much their challenge makes up of the total challenged stake.

`POST /streamregistry/approvechallenge`

Expects the following parameters:

* listing: address of the stream contract.
* stakeamount: uint, amount of DTX the challenger want to stake. Minimum of 5 DTX.




### Deny challenge on a stream

**Only admins** can deny a challenge. When a challenge is denied, 10% of the total challenge stake goes to the admin denying it. The rest of the sum of the challenges stakes and the enlist stake of the stream is transferred to the stream owner.

`POST /streamregistry/denychallenge`

Expects the following parameters:

- listing: address of the stream contract.
- stakeamount: uint, amount of DTX the challenger want to stake. Minimum of 5 DTX.




## Purchasing

### Purchasing access to a stream

- When enlisting a stream, you want to enlist some metadata too. 

  `POST /ipfs/add/json` with the following body (JSON.stringify if necessary): 

  ```
  data: {
      email: "silke@databrokerdao.com"
  }
  ```

  A succesful response returns a hash property, which you can use in the enlist call.

- Before purchasing, we need to approve the token amount (see [Before transfering tokens](?id=before-transfering-tokens))
  Make sure the amount you approve is >= the price the buyer will have to pay: **seconds from now to endtime * stream price**. You can use something like following algorithm to predict the amount: `streamPrice * (endtime - (new Date().getTime() / 1000)) + 1000 `. The 1000 seconds added at the end are a safety measure, to make sure the approved amount is high enough.

- `POST /purchaseregistry/purchaseaccess`

  Expects the following parameters: 

  - stream: address, 
  - endtime: uint, unix (= in seconds) timestamp of time when the user should lose access.
  - metadata: hash property you get back from `POST /ipfs/add/json` 



### Search for purchases

Queries the MongoDB collection where streams have been saved.

`GET /purchaseregistry/list`

Expects the following query parameters: 

- limit: uint, max number of streams to return (useful for pagination).
- skip: uint, skip to index (useful for pagination).
- sort: string, parameter on which to sort (useful for pagination).
- dir: string, sort direction, desc or asc (useful for pagination).

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
      "endtime": "1521450312", // Timestamp (Unix, in seconds) of when the user will lose access to the stream
      "metadata": "QmPkE6jz62JHia3YkV9vE8FTHmUSsHHJigrk5w8N4XTuGp",
      "email": "silke@databrokerdao.com", // Email address that needs to get stream updates
      "gatekeeper": "0xf56c9e5c364066d9f7412245126f299a8fcb5c41",
      "purchaser": "0x1b777c767e9f787ec3575ef15261b5691b0c9ffc",
      "stream": "0xdb4337a1530427dec7d2db5c82181a48accf1155", // Address of the purchased stream: you might need to query on this to only get the purchases for a certain stream
      "starttime": "1521450251",
      "price": "10", // Price per second
      "updatemetadatarole": "UPDATE_METADATA_ROLE",
      "subContractName": "Purchase"
    }
  ]
}
```



## Deploying

### Staging

To deploy to staging, we first need to **deploy the smart contracts**. There is a shell script that takes care of that for us called `deploy.staging.sh`:

```
sh deploy.staging.sh
```

Then, commit the changes to the json files in `build/contracts` with a commit message using either `fix:`(semantic patch release) or `feat: ` (semantic minor release), and push to **master**.

Check Travis ([https://travis-ci.org/DataBrokerDAO/databrokerdao-dapi](https://travis-ci.org/DataBrokerDAO/databrokerdao-dapi)) for build progress. Once the build is ready, Travis will push to DockerHub [https://hub.docker.com/r/settlemint/databrokerdao-dapi/](https://hub.docker.com/r/settlemint/databrokerdao-dapi/), DockerHub will call a webhook on Rancher to upgrade the databrokerdao-staging/databrokerdao-dapi service.




## MintNet

The blockchain network underlying this system is Ethereum, using a Proof-of-Authority consensus engine. Proof-of-Authority is a replacement for Proof-of-Work and is well suited for consortium and semi-public chain setups as it does not depend on nodes solving arbitrarily complex mathematical problems, but instead uses a set of "authorities" - nodes that are explicitly allowed to create new blocks and secure the blockchain. A Poof-of-Authority chain has to be signed off by the majority of authorities and when this is done, the record is permanently committed and recorded.

In a consortium setting, there are only advantages to using a Proof-of-Authority network. It is more secure than a small Proof-of-Work network since an attacker who gains unwanted connection or who has hacked an authority cannot overwhelm the network to modify or revert transaction. It is less computationally intensive, more performant and more predictable.

![MintNet Statistics](./mintnetstats.png)

MintNet is such a semi-public network. It has been configured in such a way that transaction costs (gas) that are associated with Ethereum transactions are removed and blocks are created in 5 second intervals. This eliminates the need for complex steps to fund wallets prior to executing a transaction on the network and it prevents having to deal with the unstable cryptocurrency exchange rates. More statistics on [https://stats.mintnet.settlemint.com](https://stats.mintnet.settlemint.com)

![MintNet Explorer](./mintnetexplorer.png)

On top of this network, a publicly available blockchain explorer is available at [https://explorer.mintnet.settlemint.com](https://explorer.mintnet.settlemint.com). Using this explorer, anyone can independently validate the content of the transactions.

If you want to run your own node on MintNet and or run the API on premise, contact [hello@settlemint.com](mailto:hello@settlemint.com).
