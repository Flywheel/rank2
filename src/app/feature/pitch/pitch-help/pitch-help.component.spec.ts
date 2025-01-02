import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PitchHelpComponent } from './pitch-help.component';

describe('PitchHelpComponent', () => {
  let component: PitchHelpComponent;
  let fixture: ComponentFixture<PitchHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PitchHelpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PitchHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
