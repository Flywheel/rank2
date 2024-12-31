import { TestBed } from '@angular/core/testing';

import { ActionKeyService } from './action-key.service';

describe('ActionKeyService', () => {
  let service: ActionKeyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionKeyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
