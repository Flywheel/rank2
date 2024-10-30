import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlateManagerComponent } from './slate-manager.component';

describe('PitchListComponent', () => {
  let component: SlateManagerComponent;
  let fixture: ComponentFixture<SlateManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlateManagerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SlateManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
