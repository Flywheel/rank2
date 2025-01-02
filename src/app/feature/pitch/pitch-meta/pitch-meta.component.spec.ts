import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PitchMetaComponent } from './pitch-meta.component';

describe('PitchMetaComponent', () => {
  let component: PitchMetaComponent;
  let fixture: ComponentFixture<PitchMetaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PitchMetaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PitchMetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
