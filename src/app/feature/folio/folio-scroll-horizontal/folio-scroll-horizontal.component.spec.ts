import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolioScrollHorizontalComponent } from './folio-scroll-horizontal.component';

describe('FolioScrollHorizontalComponent', () => {
  let component: FolioScrollHorizontalComponent;
  let fixture: ComponentFixture<FolioScrollHorizontalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FolioScrollHorizontalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FolioScrollHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
