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
    },
  },
  environments: [
    'http://localhost:3333',
    'https://dapi-staging.databrokerdao.com',
    'https://dapi.databrokerdao.com',
    'https://dapi-demo.databrokerdao.com',
  ],
}
