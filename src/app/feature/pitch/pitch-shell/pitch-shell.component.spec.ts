import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PitchShellComponent } from './pitch-shell.component';

describe('PitchShellComponent', () => {
  let component: PitchShellComponent;
  let fixture: ComponentFixture<PitchShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PitchShellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PitchShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
