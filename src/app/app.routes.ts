import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'ballot',
    loadComponent: () => import('./feature/ballot/container/container.component').then(m => m.ContainerComponent),
  },
  { path: 'folio', loadComponent: () => import('./feature/folio/folio-shell/folio-shell.component').then(m => m.FolioShellComponent) },
  // { path: '', redirectTo: 'folio', pathMatch: 'full' },
  // { path: '**', redirectTo: 'folio' },
  { path: '', redirectTo: 'ballot', pathMatch: 'full' },
  { path: '**', redirectTo: 'ballot' },
];
