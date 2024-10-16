import { Component, computed, inject } from '@angular/core';

import { ContestService } from '../contest.service';
import { Pitch } from '../../../core/models/interfaces';

@Component({
  selector: 'mh5-direct',
  standalone: true,
  imports: [],
  templateUrl: './direct.component.html',
  styleUrl: './direct.component.scss',
})
export class DirectComponent {
  db = inject(ContestService);
  contestObservable = computed(() => this.db.contestsGetAll());

  test1() {
    this.db.contestsGetAll().subscribe(data => {
      console.log(data);
    });
  }

  test2() {
    const contest: Pitch = {
      id: 4,
      closes: new Date(),
      opens: new Date(),
      contestTitle: 'New Title',
      contestDescription: 'New Description',
      authorId: '1',
    };
    this.db.contestUpdateName(contest.id, contest).subscribe(data => {
      console.log(data);
    });
  }

  test3() {
    this.db.contestGetById(4).subscribe(data => {
      console.log(data);
    });
  }

  // test4() {
  //   this.db.contestUpdateName3(4, 'New Title').subscribe(data => {
  //     console.log(data);
  //   });
  // }
}
