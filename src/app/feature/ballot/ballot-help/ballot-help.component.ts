import { Component, input } from '@angular/core';

@Component({
  selector: 'mh5-ballot-help',
  standalone: true,
  imports: [],
  templateUrl: './ballot-help.component.html',
  styleUrl: './ballot-help.component.scss',
})
export class BallotHelpComponent {
  passedInName = input.required<string>();
}
