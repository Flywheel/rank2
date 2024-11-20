import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePitchComponent } from './home-pitch.component';

describe('HomePitchComponent', () => {
  let component: HomePitchComponent;
  let fixture: ComponentFixture<HomePitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePitchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomePitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
