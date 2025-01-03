import { Component, input } from '@angular/core';
import { HeaderComponent } from '@shared/components/header/header.component';
import { BallotBodyComponent } from '../ballot-body/ballot-body.component';
import { FooterComponent } from '../../../shared/components/footer/footer.component';

@Component({
  selector: 'mh5-ballot',
  standalone: true,
  imports: [HeaderComponent, BallotBodyComponent, FooterComponent],
  templateUrl: './ballot.component.html',
  styleUrl: './ballot.component.scss',
})
export class BallotComponent {
  id = input<string>();
}
