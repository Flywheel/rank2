import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FolioShellComponent } from './folio-shell.component';

describe('FolioShellComponent', () => {
  let component: FolioShellComponent;
  let fixture: ComponentFixture<FolioShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FolioShellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FolioShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
