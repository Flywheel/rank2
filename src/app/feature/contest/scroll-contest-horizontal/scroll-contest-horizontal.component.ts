import { Component, input } from '@angular/core';
import { Contest } from '../../../core/interfaces/interfaces';
@Component({
  selector: 'mh5-scroll-contest-horizontal',
  standalone: true,
  imports: [],
  templateUrl: './scroll-contest-horizontal.component.html',
  styleUrl: './scroll-contest-horizontal.component.scss',
})
export class ScrollContestHorizontalComponent {
  theContestsInput = input<Contest[]>();

  selectContest(data: Contest) {
    console.log(data);
  }
}
