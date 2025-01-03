import { Component, signal } from '@angular/core';
import { BackdoorComponent } from '../backdoor/backdoor.component';

@Component({
  selector: 'mh5-footer',
  standalone: true,
  imports: [BackdoorComponent],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  hideBackdoor = signal<boolean>(true);
}
