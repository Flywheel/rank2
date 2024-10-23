import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PitchScrollerComponent } from './pitch-scroller.component';

describe('ContestScrollHorizontalComponent', () => {
  let component: PitchScrollerComponent;
  let fixture: ComponentFixture<PitchScrollerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PitchScrollerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PitchScrollerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
