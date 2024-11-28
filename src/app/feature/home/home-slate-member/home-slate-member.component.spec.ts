import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSlateMemberComponent } from './home-slate-member.component';

describe('HomeSlateMemberComponent', () => {
  let component: HomeSlateMemberComponent;
  let fixture: ComponentFixture<HomeSlateMemberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeSlateMemberComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeSlateMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
