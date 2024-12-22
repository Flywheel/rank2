import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ActionKeyService {
  getActionEvents(featureKey: string) {
    return (action: string) => ({
      event: `[${featureKey}] ${action}`,
      success: `[${featureKey}] ${action} Success`,
      failed: `[${featureKey}] ${action} Failed`,
    });
  }
}
