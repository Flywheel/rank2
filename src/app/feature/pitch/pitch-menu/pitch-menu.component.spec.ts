import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PitchMenuComponent } from './pitch-menu.component';

describe('PitchMenuComponent', () => {
  let component: PitchMenuComponent;
  let fixture: ComponentFixture<PitchMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PitchMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PitchMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
