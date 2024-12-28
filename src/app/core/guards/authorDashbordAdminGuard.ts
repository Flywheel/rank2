import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthorStore } from '@feature/author/author.store';

export const authDashboardAdminGuard: CanActivateFn = (route, state, authorStore = inject(AuthorStore), router = inject(Router)) => {
  console.log(`${route},  ${state}`);
  if (authorStore.consentStatus() === 'accepted') {
    console.log(`${authorStore.consentStatus().toString()}`);
    return true;
  }
  router.navigateByUrl('/author');
  return false;
};
