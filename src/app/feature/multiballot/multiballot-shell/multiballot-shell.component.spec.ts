import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiballotShellComponent } from './multiballot-shell.component';

describe('ContainerComponent', () => {
  let component: MultiballotShellComponent;
  let fixture: ComponentFixture<MultiballotShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiballotShellComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MultiballotShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
