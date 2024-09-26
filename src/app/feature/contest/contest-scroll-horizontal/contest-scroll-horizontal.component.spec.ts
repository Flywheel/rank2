import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContestScrollHorizontalComponent } from './contest-scroll-horizontal.component';

describe('ContestScrollHorizontalComponent', () => {
  let component: ContestScrollHorizontalComponent;
  let fixture: ComponentFixture<ContestScrollHorizontalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContestScrollHorizontalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContestScrollHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
