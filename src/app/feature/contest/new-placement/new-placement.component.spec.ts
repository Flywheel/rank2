import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPlacementComponent } from './new-placement.component';

describe('NewPlacementComponent', () => {
  let component: NewPlacementComponent;
  let fixture: ComponentFixture<NewPlacementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPlacementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewPlacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
