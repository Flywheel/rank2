import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BallotMenuComponent } from './ballot-menu.component';

describe('BallotMenuComponent', () => {
  let component: BallotMenuComponent;
  let fixture: ComponentFixture<BallotMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BallotMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BallotMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
