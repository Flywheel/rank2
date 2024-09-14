import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BallotStore } from '../../ballot/ballot.store';
import { LogService } from '../../../core/log/log.service';
import { Contest } from '../../../core/interfaces/interfaces';

@Component({
  selector: 'mh5-new-contest',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './new-contest.component.html',
  styleUrl: './new-contest.component.scss',
})
export class NewContestComponent {
  ballotStore = inject(BallotStore);
  logger = inject(LogService);
  contestForm: FormGroup;

  constructor(private fb: FormBuilder) {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7); // Set date to one week from today
    const nextWeekDate = nextWeek.toISOString().split('T')[0]; // Get next week's date in YYYY-MM-DD format

    this.contestForm = this.fb.group({
      contestTitle: ['', Validators.required],
      contestDescription: ['', Validators.required],
      opens: [today, Validators.required],
      closes: [nextWeekDate, Validators.required],
      authorId: [1, Validators.required], // Default value for authorId
      topSlateId: [1, Validators.required], // Default value for topSlateId
    });
  }

  onSubmit() {
    if (this.contestForm.valid) {
      const newContest: Contest = this.contestForm.value;
      if (this.logger.enabled) console.log('Submitting new contest', newContest);
      this.ballotStore.addContest(newContest);
    }
  }
}
