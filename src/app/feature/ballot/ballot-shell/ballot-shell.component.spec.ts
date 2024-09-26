import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BallotShellComponent } from './ballot-shell.component';

describe('ContainerComponent', () => {
  let component: BallotShellComponent;
  let fixture: ComponentFixture<BallotShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BallotShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BallotShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
