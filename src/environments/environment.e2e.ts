export const environment = {
  production: false,
  msalConfig: {
    auth: {
      clientId: '865c76e6-bb36-4db1-baf0-a271e9e7ea5f',
      authority: 'https://login.windows-ppe.net/common',
    },
  },
  apiConfig: {
    scopes: ['https://fram.connectid.darkedges.com/openam/oauth2/.default'],
    uri: 'https://graph.microsoft-ppe.com/v1.0/me',
  },
  patientRecord: {
    scopes: ['https://fram.connectid.darkedges.com/openam/oauth2/.default'],
    uri: 'https://kongapi.darkedges.com.au/provider/api/records/0',
  },
};
