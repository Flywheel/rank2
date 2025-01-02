import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PitchSlateComponent } from './pitch-slate.component';

describe('PitchSlateComponent', () => {
  let component: PitchSlateComponent;
  let fixture: ComponentFixture<PitchSlateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PitchSlateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PitchSlateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
