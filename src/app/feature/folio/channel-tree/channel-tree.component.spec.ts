import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelTreeComponent } from './channel-tree.component';

describe('ChannelTreeComponent', () => {
  let component: ChannelTreeComponent;
  let fixture: ComponentFixture<ChannelTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelTreeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChannelTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
