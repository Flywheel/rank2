import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NamegetterComponent } from './namegetter.component';

describe('NamegetterComponent', () => {
  let component: NamegetterComponent;
  let fixture: ComponentFixture<NamegetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NamegetterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NamegetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
