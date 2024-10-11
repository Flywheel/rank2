import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolioPlacementMediaComponent } from './folio-placement-media.component';

describe('FolioPlacementMediaComponent', () => {
  let component: FolioPlacementMediaComponent;
  let fixture: ComponentFixture<FolioPlacementMediaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FolioPlacementMediaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FolioPlacementMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
