import { Component, input } from '@angular/core';
import { HeaderComponent } from '../../../core/components/header/header.component';
import { BallotBodyComponent } from '../ballot-body/ballot-body.component';

@Component({
  selector: 'mh5-ballot',
  standalone: true,
  imports: [HeaderComponent, BallotBodyComponent],
  templateUrl: './ballot.component.html',
  styleUrl: './ballot.component.scss',
})
export class BallotComponent {
  id = input<string>();
}
