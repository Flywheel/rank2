import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiballotMenuComponent } from './multiballot-menu.component';

describe('MultiballotMenuComponent', () => {
  let component: MultiballotMenuComponent;
  let fixture: ComponentFixture<MultiballotMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiballotMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiballotMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
