import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeShellComponent } from './home-shell.component';

describe('HomeShellComponent', () => {
  let component: HomeShellComponent;
  let fixture: ComponentFixture<HomeShellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeShellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
