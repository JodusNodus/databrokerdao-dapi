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

## API

*Sidenote: for now, DataBroker DAO only works with streams. In the future, datasets will be available too.*

### Enlist a stream

### Challenge a stream

### Deny challenge 

### Approve challenge

### Purchase access to a stream



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

## MintNet

The blockchain network underlying this system is Ethereum, using a Proof-of-Authority consensus engine. Proof-of-Authority is a replacement for Proof-of-Work and is well suited for consortium and semi-public chain setups as it does not depend on nodes solving arbitrarily complex mathematical problems, but instead uses a set of "authorities" - nodes that are explicitly allowed to create new blocks and secure the blockchain. A Poof-of-Authority chain has to be signed off by the majority of authorities and when this is done, the record is permanently committed and recorded.

In a consortium setting, there are only advantages to using a Proof-of-Authority network. It is more secure than a small Proof-of-Work network since an attacker who gains unwanted connection or who has hacked an authority cannot overwhelm the network to modify or revert transaction. It is less computationally intensive, more performant and more predictable.

![MintNet Statistics](./mintnetstats.png)

MintNet is such a semi-public network. It has been configured in such a way that transaction costs (gas) that are associated with Ethereum transactions are removed and blocks are created in 5 second intervals. This eliminates the need for complex steps to fund wallets prior to executing a transaction on the network and it prevents having to deal with the unstable cryptocurrency exchange rates. More statistics on [https://stats.mintnet.settlemint.com](https://stats.mintnet.settlemint.com)

![MintNet Explorer](./mintnetexplorer.png)

On top of this network, a publicly available blockchain explorer is available at [https://explorer.mintnet.settlemint.com](https://explorer.mintnet.settlemint.com). Using this explorer, anyone can independently validate the content of the transactions.

If you want to run your own node on MintNet and or run the API on premise, contact [hello@settlemint.com](mailto:hello@settlemint.com).
