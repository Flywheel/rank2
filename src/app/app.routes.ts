import { Routes } from '@angular/router';
import { authDashboardAdminGuard } from './core/guards/authorDashbordAdminGuard';
import { BallotComponent } from './feature/ballot/ballot/ballot.component';

const DEFAULT_ROUTE = 'home';

export const routes: Routes = [
  {
    path: 'contests',
    loadComponent: () => import('./feature/ballot/ballot-shell/ballot-shell.component').then(m => m.BallotShellComponent),
  },
  { path: 'contest', redirectTo: 'contests' },
  { path: 'ballot/:id', component: BallotComponent },

  { path: 'folio', loadComponent: () => import('./feature/folio/folio-shell/folio-shell.component').then(m => m.FolioShellComponent) },
  { path: 'home', loadComponent: () => import('./feature/home/home-shell/home-shell.component').then(m => m.HomeShellComponent) },
  {
    path: 'dashboard',
    loadComponent: () => import('./feature/author/author-dashboard/author-dashboard.component').then(m => m.AuthorDashboardComponent),
    canActivate: [authDashboardAdminGuard],
  },
  { path: 'author', loadComponent: () => import('./feature/author/author-shell/author-shell.component').then(m => m.AuthorShellComponent) },

  { path: '', redirectTo: DEFAULT_ROUTE, pathMatch: 'full' },
  { path: '**', redirectTo: DEFAULT_ROUTE },
];
