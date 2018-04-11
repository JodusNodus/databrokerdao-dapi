module.exports = {
  // ipfs: {
  //   host: 'ipfs.infura.io',
  // },
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
        registry: 'Sensor',
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
    features: {
      statistics: {
        enabled: false,
      },
      ui: {
        enabled: false,
      },
    },
  },
  environments: [
    'http://localhost:3333',
    'https://dapi-staging.databrokerdao.com',
    'https://dapi.databrokerdao.com',
    'https://dapi-demo.databrokerdao.com',
  ],
}
