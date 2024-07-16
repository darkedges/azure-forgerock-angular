export const environment = {
  production: false,
  msalConfig: {
    auth: {
      clientId: '62236bd1-62b4-480c-9f2b-470f8912947a',
      authority: 'https://login.microsoftonline.com/4161be3f-bf2b-41d4-a02b-e6f82b529d53',
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
