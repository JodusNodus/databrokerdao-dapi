const HDWalletProvider = require('truffle-hdwallet-provider')

module.exports = {
  solc: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  networks: {
    development: {
      provider: () => {
        return new HDWalletProvider(
          process.env.ETHEREUM_DEPLOYER_SEED ||
            'robot robot robot robot robot robot robot robot robot robot robot robot',
          'http://localhost:8545'
        )
      },
      gasPrice: 0x00,
      network_id: '1337',
    },
    mintnet: {
      provider: () => {
        return new HDWalletProvider(
          process.env.ETHEREUM_DEPLOYER_SEED,
          'https://mintnet.settlemint.com'
        )
      },
      gasPrice: 0x00,
      network_id: '8995',
    },
    minttestnet: {
      provider: () => {
        return new HDWalletProvider(
          process.env.ETHEREUM_DEPLOYER_SEED ||
            'robot robot robot robot robot robot robot robot robot robot robot robot',
          'https://minttestnet.settlemint.com'
        )
      },
      gasPrice: 0x00,
      network_id: '8996',
    },
    kovan: {
      provider: () => {
        return new HDWalletProvider(
          process.env.ETHEREUM_DEPLOYER_SEED,
          'https://kovan.infura.io/'
        )
      },
      network_id: '42',
      gas: 4700000,
    },
    ropsten: {
      provider: () => {
        return new HDWalletProvider(
          process.env.ETHEREUM_DEPLOYER_SEED,
          'https://ropsten.infura.io/'
        )
      },
      network_id: '3',
    },
    rinkeby: {
      provider: () => {
        return new HDWalletProvider(
          process.env.ETHEREUM_DEPLOYER_SEED,
          'https://rinkeby.infura.io/'
        )
      },
      network_id: '4',
    },
  },
}
