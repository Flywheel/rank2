import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolioPlacementNewComponent } from './folio-placement-new.component';

describe('FolioPlacementNewComponent', () => {
  let component: FolioPlacementNewComponent;
  let fixture: ComponentFixture<FolioPlacementNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FolioPlacementNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FolioPlacementNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
