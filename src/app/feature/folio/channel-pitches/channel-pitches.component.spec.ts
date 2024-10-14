import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PitchListComponent } from './channel-pitches.component';

describe('PitchListComponent', () => {
  let component: PitchListComponent;
  let fixture: ComponentFixture<PitchListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PitchListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PitchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
