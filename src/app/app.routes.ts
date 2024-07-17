import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { FailedComponent } from './components/failed/failed.component';
import { HomeComponent } from './components/home/home.component';
import { PatientRecordComponent } from './components/patientRecord/patientRecord.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CSRComponent } from './components/csr/csr.component';

export const routes: Routes = [
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [MsalGuard],
  },
  {
    path: 'patientRecord',
    component: PatientRecordComponent,
    canActivate: [MsalGuard],
  },
  {
    path: 'csr',
    component: CSRComponent,
    canActivate: [MsalGuard],
  },
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login-failed',
    component: FailedComponent,
  },
];
