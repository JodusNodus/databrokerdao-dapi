module.exports = {
  ipfs: {
    host: 'ipfs.infura.io',
    protocol: 'https',
    port: 5001,
  },
  ethereum: {
    tokenRegistryCombos: [
      {
        registry: 'DtxTokenRegistry',
        token: 'DtxToken',
      },
      {
        registry: 'SensorRegistry',
        token: 'Sensor',
      },
      {
        registry: 'PurchaseRegistry',
        token: 'Purchase',
      },
      {
        registry: 'ChallengeRegistry',
        token: 'Challenge',
      },
    ],
    contractsThatGetDeployedByOtherContracts: [
      'Purchase',
      'Sensor',
      'DtxToken',
      'Challenge',
    ],
    roleRegistries: ['Administrators', 'Curators'],
    // features: {
    //   contracts: {
    //     enabled: true,
    //   },
    //   statistics: {
    //     enabled: false,
    //   },
    //   ui: {
    //     enabled: false,
    //   },
    // },
  },
  environments: [
    'http://localhost:3333',
    'https://dapi-staging.databrokerdao.com',
    'https://dapi.databrokerdao.com',
    'https://dapi-demo.databrokerdao.com',
  ],
}
