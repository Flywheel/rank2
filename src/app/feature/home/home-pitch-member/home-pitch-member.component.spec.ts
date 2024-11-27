import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePitchMemberComponent } from './home-pitch-member.component';

describe('HomePitchMemberComponent', () => {
  let component: HomePitchMemberComponent;
  let fixture: ComponentFixture<HomePitchMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePitchMemberComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomePitchMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
