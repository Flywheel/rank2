import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PitchNewComponent } from './pitch-new.component';

describe('NewContestComponent', () => {
  let component: PitchNewComponent;
  let fixture: ComponentFixture<PitchNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PitchNewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PitchNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
