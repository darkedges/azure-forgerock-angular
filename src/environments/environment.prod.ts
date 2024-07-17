export const environment = {
  production: true,
  msalConfig: {
    auth: {
      clientId: '62236bd1-62b4-480c-9f2b-470f8912947a',
      authority: 'https://login.microsoftonline.com/4161be3f-bf2b-41d4-a02b-e6f82b529d53',
    },
  },
  apiConfig: {
    scopes: ['https://fram.connectid.darkedges.com/openam/oauth2/.default'],
    uri: 'https://graph.microsoft.com/v1.0/me',
  },
  patientRecord: {
    scopes: ['https://fram.connectid.darkedges.com/openam/oauth2/.default'],
    uri: 'https://kongapi.darkedges.com.au/provider/api/records/0',
  },
  firebaseConfig: {
    apiKey: "AIzaSyCWelE17KhC5uaSWw8dYSb5i8C5mgfAnks",
    authDomain: "verifymyiddemo.firebaseapp.com",
    databaseURL: "https://verifymyiddemo.firebaseio.com",
    projectId: "verifymyiddemo",
    storageBucket: "verifymyiddemo.appspot.com",
    messagingSenderId: "746700244440",
    appId: "1:746700244440:web:c5951acc1073a9a8c05ead"
  },
  forgerock: {
    ciba: {
      requestUri: 'https://fram.connectid.darkedges.com/openam/oauth2/bc-authorize',
      accessTokenUri: 'https://fram.connectid.darkedges.com/openam/oauth2/access_token',
      clientId: 'BackChannel',
      clientSecret: 'BackChannel'
    },
    workforceFederatedIdentity: {
      accessTokenUri: 'https://fram.connectid.darkedges.com/openam/oauth2/access_token',
      clientId: 'SalesforceClient',
      clientSecret: 'SalesforceClient'
    }
  }
};
