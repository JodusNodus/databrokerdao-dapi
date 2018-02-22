module.exports = {
  ethereum: {
    tokenRegistryCombos: [
      {
        registry: 'DtxTokenRegistry',
        token: 'DtxToken',
      },
    ],
    contractsThatGetDeployedByOtherContracts: [],
    roleRegistries: ['Administrators', 'Curators', 'Users'],
    features: {
      statistics: {
        enabled: false,
      },
      ui: {
        enabled: false,
      },
      mywallet: {
        enabled: false,
      },
      allevents: {
        enabled: false,
      },
      newwallet: {
        enabled: false,
      },
      roles: {
        enabled: false,
      },
    },
  },
  environments: [
    'http://localhost:3333',
    'https://databroker-dapi-staging.settlemint.com',
    'https://databroker-dapi.settlemint.com',
    'https://databroker-dapi-demo.settlemint.com',
  ],
}
