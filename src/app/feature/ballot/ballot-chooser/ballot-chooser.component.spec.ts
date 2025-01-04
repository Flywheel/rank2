import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BallotChooserComponent } from './ballot-chooser.component';

describe('BallotChooserComponent', () => {
  let component: BallotChooserComponent;
  let fixture: ComponentFixture<BallotChooserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BallotChooserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BallotChooserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
