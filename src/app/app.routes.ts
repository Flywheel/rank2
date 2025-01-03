import { Routes } from '@angular/router';
import { authDashboardAdminGuard } from '@shared/guards/authorDashbordAdminGuard';
import { PitchChooserComponent } from '@feature/pitch/pitch-chooser/pitch-chooser.component';

const DEFAULT_ROUTE = 'home';

export const routes: Routes = [
  {
    path: 'contests',
    loadComponent: () =>
      import('./feature/multiballot/multiballot-shell/multiballot-shell.component').then(m => m.MultiballotShellComponent),
  },
  { path: 'contest', redirectTo: 'contests' },
  { path: 'pitch/:id', component: PitchChooserComponent },

  {
    path: 'ballotInSpa/:id',
    loadComponent: () => import('./feature/ballot/ballot-shell/ballot-shell.component').then(m => m.BallotShellComponent),
  },

  {
    path: 'ballot/:id',
    loadComponent: () => import('./feature/ballot/ballot-chooser/ballot-chooser.component').then(m => m.BallotChooserComponent),
  },
  { path: 'folio', loadComponent: () => import('@feature/folio/folio-shell/folio-shell.component').then(m => m.FolioShellComponent) },
  { path: 'home', loadComponent: () => import('./feature/pitch/pitch-shell/pitch-shell.component').then(m => m.PitchShellComponent) },
  {
    path: 'dashboard',
    loadComponent: () => import('@feature/author/author-dashboard/author-dashboard.component').then(m => m.AuthorDashboardComponent),
    canActivate: [authDashboardAdminGuard],
  },
  { path: 'author', loadComponent: () => import('@feature/author/author-shell/author-shell.component').then(m => m.AuthorShellComponent) },

  { path: '', redirectTo: DEFAULT_ROUTE, pathMatch: 'full' },
  { path: '**', redirectTo: DEFAULT_ROUTE },
];
