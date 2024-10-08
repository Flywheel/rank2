import { Routes } from '@angular/router';
import { authDashboardAdminGuard } from './core/guards/authorDashbordAdminGuard';

const DEFAULT_ROUTE = 'ballot';

export const routes: Routes = [
  {
    path: 'ballot',
    loadComponent: () => import('./feature/ballot/ballot-shell/ballot-shell.component').then(m => m.BallotShellComponent),
  },
  { path: 'contest', redirectTo: 'ballot' },

  { path: 'folio', loadComponent: () => import('./feature/folio/folio-shell/folio-shell.component').then(m => m.FolioShellComponent) },
  {
    path: 'dashboard',
    loadComponent: () => import('./feature/author/author-dashboard/author-dashboard.component').then(m => m.AuthorDashboardComponent),
    canActivate: [authDashboardAdminGuard],
  },
  { path: 'author', loadComponent: () => import('./feature/author/author-shell/author-shell.component').then(m => m.AuthorShellComponent) },

  { path: '', redirectTo: DEFAULT_ROUTE, pathMatch: 'full' },
  { path: '**', redirectTo: DEFAULT_ROUTE },
];
