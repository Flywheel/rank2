import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlatesAuthoredComponent } from './slates-authored.component';

describe('SlatesAuthoredComponent', () => {
  let component: SlatesAuthoredComponent;
  let fixture: ComponentFixture<SlatesAuthoredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlatesAuthoredComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlatesAuthoredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
