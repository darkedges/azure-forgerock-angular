import { AsyncPipe, CommonModule, JsonPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, ContentChild, TemplateRef } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MsalService } from '@azure/msal-angular';
import { SilentRequest } from '@azure/msal-browser';
import { jwtDecode } from 'jwt-decode';
import { Highlight } from 'ngx-highlightjs';
import { HighlightLineNumbers } from 'ngx-highlightjs/line-numbers';
import { LocalStorageService } from 'ngx-localstorage';
import { Observable } from 'rxjs';
import { ForgerockService } from 'src/app/services/forgerock.service';
import { KongService, PatientRecord } from 'src/app/services/kong.service';
import { LoadingService } from 'src/app/services/loading.service';
import { environment } from 'src/environments/environment';
import { JwtHighlightComponent } from '../jwt-highlight.component';

interface User {
  email: string,
  rowId: string
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
    MatCardModule,
    JwtHighlightComponent,
    Highlight,
    HighlightLineNumbers
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

  showPatientRecord: boolean = false
  patientRecord: PatientRecord | undefined

  loading$: Observable<boolean>;
  @ContentChild("loading")
  customLoadingIndicator: TemplateRef<any> | null = null;

  users$: Observable<User[]>;
  //accessToken$: Observable<string>;

  constructor(
    private http: HttpClient,
    private store: Firestore,
    private forgerock: ForgerockService,
    private kong: KongService,
    private loading: LoadingService,
    private localStorage: LocalStorageService,
    private authService: MsalService,
    private dialog: MatDialog
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

  async getUserAccessToken(username: string, index: string) {
    this.showPatientRecord = false
    this.userAccessToken = await this.forgerock.getUserAccessToken(username);
    this.decodedUserAccessToken = jwtDecode(this.userAccessToken)
    this.localStorage.set('subjectAccessToken', this.userAccessToken)
    this.showUserAccessTokenCard = true;
    this.forgerock.getTokenExchange(this.localStorage.get('actorAccessToken')!, this.userAccessToken)
      .subscribe(x => {
        this.delegatedAccessToken = x.access_token
        this.decodedDelegatedAccessToken = jwtDecode(x.access_token);
        this.localStorage.set('delegatedAccessToken', x.access_token)
        this.showDelegatedAccessTokenCard = true;
        this.kong.getPatientRecord(x.access_token, index)
          .subscribe(data => {
            this.patientRecord = data;
            this.showPatientRecord = true;
          }, error => {
            this.dialog.open(AccessDeniedDialog);
            this.showPatientRecord = false;
          })
      })
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

@Component({
  selector: 'dialog-access-denied',
  templateUrl: 'accessDeniedDialog.html',
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessDeniedDialog { }