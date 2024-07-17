import { Routes } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { FailedComponent } from './components/failed/failed.component';
import { CSRComponent } from './components/csr/csr.component';

export const routes: Routes = [
  {
    path: 'csr',
    component: CSRComponent,
    canActivate: [MsalGuard],
  },
  { 
    path: '', 
    redirectTo: 'csr', 
    pathMatch: 'full' 
  },
  {
    path: 'login-failed',
    component: FailedComponent,
  },
];
