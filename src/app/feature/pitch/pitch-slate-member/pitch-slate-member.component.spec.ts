import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PitchSlateMemberComponent } from './pitch-slate-member.component';

describe('PitchSlateMemberComponent', () => {
  let component: PitchSlateMemberComponent;
  let fixture: ComponentFixture<PitchSlateMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PitchSlateMemberComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PitchSlateMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
