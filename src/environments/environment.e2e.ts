export const environment = {
  production: false,
  msalConfig: {
    auth: {
      clientId: 'edd9f241-d550-4de8-845d-3fa299090014',
      authority: 'https://login.microsoftonline.com/4161be3f-bf2b-41d4-a02b-e6f82b529d53',
    },
  },
  apiConfig: {
    scopes: ['User.Read'],
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
      requestUri: '/forgerock/oauth2/bc-authorize',
      accessTokenUri: '/forgerock/oauth2/access_token',
      clientId: 'BackChannel',
      clientSecret: 'BackChannel'
    },
    workforceFederatedIdentity: {
      accessTokenUri: '/forgerock/oauth2/access_token',
      clientId: 'SalesforceClient',
      clientSecret: 'SalesforceClient'
    }
  }
};
