import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ActionKeyService {
  getActionEvents(group: string) {
    return (action: string) => ({
      event: `[${group}] ${action}`,
      success: `[${group}] ${action} Success`,
      failed: `[${group}] ${action} Failed`,
    });
  }
}
