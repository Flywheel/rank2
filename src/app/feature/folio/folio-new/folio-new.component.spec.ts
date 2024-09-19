import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolioNewComponent } from './folio-new.component';

describe('FolioNewComponent', () => {
  let component: FolioNewComponent;
  let fixture: ComponentFixture<FolioNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FolioNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FolioNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
