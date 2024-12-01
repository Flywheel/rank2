import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PitchManagerComponent } from './pitch-manager.component';

describe('PitchManagerComponent', () => {
  let component: PitchManagerComponent;
  let fixture: ComponentFixture<PitchManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PitchManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PitchManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
