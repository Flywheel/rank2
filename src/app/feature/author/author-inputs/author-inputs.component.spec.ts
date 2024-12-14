import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorInputsComponent } from './author-inputs.component';

describe('AuthorInputsComponent', () => {
  let component: AuthorInputsComponent;
  let fixture: ComponentFixture<AuthorInputsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorInputsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorInputsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
