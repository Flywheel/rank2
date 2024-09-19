import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/header/header.component';

@Component({
  selector: 'mh5-viewer',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './viewer.component.html',
  styleUrl: './viewer.component.scss',
})
export class ViewerComponent {}
