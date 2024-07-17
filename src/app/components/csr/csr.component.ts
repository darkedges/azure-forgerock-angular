import { AsyncPipe, CommonModule, JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ContentChild, TemplateRef } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ForgerockService } from 'src/app/services/forgerock.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from 'src/app/services/loading.service';
import { LocalStorageService } from 'ngx-localstorage';
import { jwtDecode } from 'jwt-decode';
import { MsalService } from '@azure/msal-angular';
import { SilentRequest } from '@azure/msal-browser';
import { environment } from 'src/environments/environment';
import { MatCardModule } from '@angular/material/card';

interface User {
  email: string,
};

@Component({
  selector: 'app-csr',
  templateUrl: './csr.component.html',
  styleUrls: ["./csr.component.scss"],
  imports: [
    AsyncPipe,
    JsonPipe,
    CommonModule,
    MatProgressSpinnerModule,
    MatCardModule
  ],
  standalone: true,
})
export class CSRComponent {
  showUserAccessToken: boolean = false
  showCSRAccessToken: boolean = false
  showWorkforceAccessToken: boolean = false
  showDelegatedAccessToken: boolean = false

  showCSRAccessTokenCard: boolean = false;
  showWorkforceAccessTokenCard: boolean = false;
  showUserAccessTokenCard: boolean = false;
  showDelegatedAccessTokenCard: boolean = false;

  userAccessToken: string = ""
  decodedUserAccessToken: string = ""

  csrAccessToken: string = ""
  decodedCsrAccessToken: string = ""

  workforceAccessToken = ""
  decodedWorkforceAccessToken = ""

  delegatedAccessToken = ""
  decodedDelegatedAccessToken = ""

  loading$: Observable<boolean>;
  @ContentChild("loading")
  customLoadingIndicator: TemplateRef<any> | null = null;

  users$: Observable<User[]>;
  //accessToken$: Observable<string>;

  constructor(
    private http: HttpClient,
    private store: Firestore,
    private forgerock: ForgerockService,
    private loading: LoadingService,
    private localStorage: LocalStorageService,
    private authService: MsalService
  ) {
    const userCollection = collection(this.store, 'users');
    this.users$ = collectionData(userCollection) as Observable<User[]>;
    this.loading$ = this.loading.loading$;
    const accessTokenRequest = {
      scopes: environment.patientRecord.scopes,
      account: this.authService.instance.getActiveAccount()
    } as SilentRequest
    this.authService.acquireTokenSilent(accessTokenRequest)
      .subscribe(r => {
        this.csrAccessToken = r.accessToken
        this.decodedCsrAccessToken = jwtDecode(r.accessToken);
        this.showCSRAccessTokenCard = true;
        this.forgerock.getWorkforceFederatedIdentity(r.accessToken)
          .subscribe(t => {
            this.workforceAccessToken = t.access_token
            this.decodedWorkforceAccessToken = jwtDecode(t.access_token);
            this.localStorage.set('actorAccessToken', t.access_token)
            this.showWorkforceAccessTokenCard = true;
          });
      });
  }

  async getUserAccessToken(username: string) {
    this.userAccessToken = await this.forgerock.getUserAccessToken(username);
    this.decodedUserAccessToken = jwtDecode(this.userAccessToken)
    this.localStorage.set('subjectAccessToken', this.userAccessToken)
    this.showUserAccessTokenCard = true;
  }

  updateUserAccessToken() {
    this.showUserAccessToken = !this.showUserAccessToken;
  }

  updateWorkforceAccessToken() {
    this.showWorkforceAccessToken = !this.showWorkforceAccessToken;
  }

  updateCSRAccessToken() {
    this.showCSRAccessToken = !this.showCSRAccessToken;
  }

  updateDelegatedAccessToken() {
    this.showDelegatedAccessToken = !this.showDelegatedAccessToken;
  }

}
