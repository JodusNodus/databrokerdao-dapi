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
        registry: 'StreamRegistry',
        token: 'Stream',
      },
    ],
    contractsThatGetDeployedByOtherContracts: ['Purchase', 'Stream'],
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
