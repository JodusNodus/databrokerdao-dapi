module.exports = {
  ethereum: {
    tokenRegistryCombos: [
      {
        registry: 'DtxTokenRegistry',
        token: 'Token',
      },
    ],
    contractsThatGetDeployedByOtherContracts: [],
    roleRegistries: ['Administrators', 'Curators', 'Users'],
  },
  environments: [
    'http://localhost:3333',
    'https://databroker-dapi-staging.settlemint.com',
    'https://databroker-dapi.settlemint.com',
    'https://databroker-dapi-demo.settlemint.com',
  ],
}
