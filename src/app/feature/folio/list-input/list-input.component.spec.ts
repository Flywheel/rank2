import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListInputComponent } from './list-input.component';

describe('ListInputComponent', () => {
  let component: ListInputComponent;
  let fixture: ComponentFixture<ListInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
