import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'ballot',
    loadComponent: () => import('./feature/ballot/container/container.component').then(m => m.ContainerComponent),
  },
  //   {
  //     path: 'content/:mediaType/:sourceId',
  //     loadComponent: () => import('./feature/content/viewer/viewer.component').then(m => m.ViewerComponent),
  //   },
  { path: '', redirectTo: 'ballot', pathMatch: 'full' },
  { path: '**', redirectTo: 'ballot' },
];
