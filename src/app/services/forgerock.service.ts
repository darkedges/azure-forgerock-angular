import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KJUR } from 'jsrsasign';
import { Observable, lastValueFrom, mergeMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoadingService } from './loading.service';

interface cibaRequestResponse {
  auth_req_id: string
  expires_in: number
  interval: number
}

interface cibaAccessTokenResponse {
  "access_token": string
  "refresh_token": string
  "scope": string
  "id_token": string
  "token_type": string
  "expires_in": number
}



@Injectable({
  providedIn: 'root'
})
export class ForgerockService {
  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) { }

  async getUserAccessToken(username: string) {
    const at: cibaAccessTokenResponse = await lastValueFrom(this.getCIBARequest(username))
    return at.access_token;
  }

  getWorkforceFederatedIdentity(assertion: string) {
    const url = environment.forgerock.workforceFederatedIdentity.accessTokenUri;
    const clientId = environment.forgerock.workforceFederatedIdentity.clientId;
    const clientSecret = environment.forgerock.workforceFederatedIdentity.clientSecret;
    const body = new URLSearchParams();
    body.set('client_id', clientId)
    body.set('client_secret', clientSecret)
    body.set('grant_type', 'urn:ietf:params:oauth:grant-type:jwt-bearer')
    body.set('assertion', assertion)
    body.set('redirect_uri', 'https://d2w000003ksmdeag-dev-ed.my.salesforce.com/services/authcallback/CIAM')
    body.set('scope', 'read_accounts')
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };
    return this.http.post<any>(url, body.toString(), options);
  }

  getCIBARequest(username: string): Observable<cibaAccessTokenResponse> {
    const url = environment.forgerock.ciba.requestUri;
    const clientId = environment.forgerock.ciba.clientId;
    const clientSecret = environment.forgerock.ciba.clientSecret;
    const body = new URLSearchParams();
    body.set('request', this.generateSignedPayload(username))
    body.set('client_id', clientId)
    body.set('client_secret', clientSecret)
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };
    return this.http.post<cibaRequestResponse>(url, body.toString(), options)
      .pipe(
        mergeMap((r) => this.getCIBAAccessToken(r))
      );
  }

  getCIBAAccessToken(request: any) {
    const url = environment.forgerock.ciba.accessTokenUri;
    const clientId = environment.forgerock.ciba.clientId;
    const clientSecret = environment.forgerock.ciba.clientSecret;
    const body = new URLSearchParams();
    body.set('auth_req_id', request.auth_req_id)
    body.set('grant_type', 'urn:openid:params:grant-type:ciba')
    body.set('client_id', clientId)
    body.set('client_secret', clientSecret)
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };
    return this.http.post<cibaAccessTokenResponse>(url, body.toString(), options);
  }

  getTokenExchange(actor: string, subject: string) {
    const url = environment.forgerock.workforceFederatedIdentity.accessTokenUri;
    const clientId = environment.forgerock.workforceFederatedIdentity.clientId;
    const clientSecret = environment.forgerock.workforceFederatedIdentity.clientSecret;
    const body = new URLSearchParams();
    body.set('grant_type', 'urn:ietf:params:oauth:grant-type:token-exchange')
    body.set('scope', 'openid read_accounts')
    body.set('subject_token', subject)
    body.set('subject_token_type', 'urn:ietf:params:oauth:token-type:access_token')
    body.set('actor_token', actor)
    body.set('actor_token_type', 'urn:ietf:params:oauth:token-type:access_token')
    body.set('requested_token_type', 'urn:ietf:params:oauth:token-type:access_token')
    body.set('client_id', clientId)
    body.set('client_secret', clientSecret)
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };
    return this.http.post<any>(url, body.toString(), options);
  }

  generateSignedPayload(username: string): string {
    var jwtPrivateKey = `-----BEGIN PRIVATE KEY-----
MEECAQAwEwYHKoZIzj0CAQYIKoZIzj0DAQcEJzAlAgEBBCBhcd917i92ApyaZZ16
t4qJEofiHn18yKsBCMq3uTRwjA==
-----END PRIVATE KEY-----`;

    // Set headers for JWT
    var header = {
      'alg': 'ES256',
      'typ': 'JWT',
      'kid': 'myCibaKey'
    };
    var currentTimestamp = Math.floor(Date.now() / 1000);
    var payload = {
      "aud": "https://fram.connectid.darkedges.com/openam/oauth2",
      "binding_message": "Allow ExampleBank to transfer £50 from 'Main' to 'Savings'? (EB-0246326)",
      "acr_values": "email",
      "exp": currentTimestamp + 60 * 5,
      "iss": "BackChannel",
      "login_hint": username,
      "scope": "openid read_accounts transfer"
    };
    var sHeader = JSON.stringify(header);
    var sPayload = JSON.stringify(payload);

    return KJUR.jws.JWS.sign(header.alg, sHeader, sPayload, jwtPrivateKey);

  }
}
