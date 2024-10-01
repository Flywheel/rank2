import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'ballot',
    loadComponent: () => import('./feature/ballot/ballot-shell/ballot-shell.component').then(m => m.BallotShellComponent),
  },
  { path: 'contest', redirectTo: 'ballot' },
  { path: 'folio', loadComponent: () => import('./feature/folio/folio-shell/folio-shell.component').then(m => m.FolioShellComponent) },
  { path: 'author', loadComponent: () => import('./feature/author/author-shell/author-shell.component').then(m => m.AuthorShellComponent) },
  // // { path: '', redirectTo: 'folio', pathMatch: 'full' },
  // // // { path: '**', redirectTo: 'folio' },
  // { path: '', redirectTo: 'author', pathMatch: 'full' },
  // { path: '**', redirectTo: 'author' },
  { path: '', redirectTo: 'ballot', pathMatch: 'full' },
  { path: '**', redirectTo: 'ballot' },
];
