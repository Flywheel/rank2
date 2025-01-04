import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BallotHelpComponent } from './ballot-help.component';

describe('BallotHelpComponent', () => {
  let component: BallotHelpComponent;
  let fixture: ComponentFixture<BallotHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BallotHelpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BallotHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
