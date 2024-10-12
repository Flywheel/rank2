import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelAssetsComponent } from './channel-assets.component';

describe('ChannelAssetsComponent', () => {
  let component: ChannelAssetsComponent;
  let fixture: ComponentFixture<ChannelAssetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelAssetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChannelAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
