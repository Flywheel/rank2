import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorConsentComponent } from './author-consent.component';

describe('AuthorConsentComponent', () => {
  let component: AuthorConsentComponent;
  let fixture: ComponentFixture<AuthorConsentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorConsentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
