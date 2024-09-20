import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolioPlacementListComponent } from './folio-placement-list.component';

describe('FolioPlacementListComponent', () => {
  let component: FolioPlacementListComponent;
  let fixture: ComponentFixture<FolioPlacementListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FolioPlacementListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FolioPlacementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
