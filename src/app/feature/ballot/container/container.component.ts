import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { BodyComponent } from '../body/body.component';
import { ViewerComponent } from '../viewer/viewer.component';

@Component({
  selector: 'mh5-container',
  standalone: true,
  imports: [HeaderComponent, BodyComponent, ViewerComponent],
  templateUrl: './container.component.html',
  styleUrl: './container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContainerComponent {}
