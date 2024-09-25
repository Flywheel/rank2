export const environment = {
  production: true,
  HOST_DOMAIN: 'https://mh5.netlify.app',
  azureSasToken: process.env['AZURE_SAS_TOKEN'], // Netlify will replace this with the actual value
  azureStorageAccount: process.env['AZURE_STORAGE_ACCOUNT'], // Netlify will replace this with the actual value
  emailEncryptionKey: process.env['EMAIL_ENCRYPTION_KEY'], // Netlify will replace this with the actual value
  betaTestAuthKey: process.env['BETA_AUTH_KEY'], // Netlify will replace this with the actual value
  ianConfig: {
    hideAuthorComponent: true,
    hideLogs: true,
  },
};
