import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollContestHorizontalComponent } from './scroll-contest-horizontal.component';

describe('ScrollContestHorizontalComponent', () => {
  let component: ScrollContestHorizontalComponent;
  let fixture: ComponentFixture<ScrollContestHorizontalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollContestHorizontalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrollContestHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
