const HDWalletProvider = require('truffle-hdwallet-provider');

module.exports = {
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '1337'
    },
    mintnet: {
      provider: new HDWalletProvider(
        process.env.ETHEREUM_DEPLOYER_SEED,
        'http://165.227.153.108:8545'
      ),
      network_id: '8995'
    },
    kovan: {
      provider: new HDWalletProvider(
        process.env.ETHEREUM_DEPLOYER_SEED,
        'https://kovan.infura.io/'
      ),
      network_id: '42',
      gas: 4700000
    },
    ropsten: {
      provider: new HDWalletProvider(
        process.env.ETHEREUM_DEPLOYER_SEED,
        'https://ropsten.infura.io/'
      ),
      network_id: '3'
    },
    rinkeby: {
      provider: new HDWalletProvider(
        process.env.ETHEREUM_DEPLOYER_SEED,
        'https://rinkeby.infura.io/'
      ),
      network_id: '4'
    },
    coverage: {
      host: 'localhost',
      network_id: '*',
      port: 8555, // <-- Use port 8555
      gas: 0xfffffffffff, // <-- Use this high gas value
      gasPrice: 0x01 // <-- Use this low gas price
    }
  }
};
