import { TestBed } from '@angular/core/testing';

import { HydrationService } from './hydration.service';

describe('LocalStorageService', () => {
  let service: HydrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HydrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
