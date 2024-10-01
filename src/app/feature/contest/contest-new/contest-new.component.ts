import { Component, inject, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BallotStore } from '../../ballot/ballot.store';
import { Contest } from '../../../core/interfaces/interfaces';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'mh5-contest-new',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contest-new.component.html',
  styleUrl: './contest-new.component.scss',
})
export class ContestNewComponent {
  ballotStore = inject(BallotStore);

  formGroup: FormGroup;
  closeNewContestEditor = output<boolean>();

  constructor(private fb: FormBuilder) {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7); // Set date to one week from today
    const nextWeekDate = nextWeek.toISOString().split('T')[0]; // Get next week's date in YYYY-MM-DD format

    this.formGroup = this.fb.group({
      contestTitle: ['', Validators.required],
      contestDescription: ['', Validators.required],
      opens: [today, Validators.required],
      closes: [nextWeekDate, Validators.required],
      authorId: [1, Validators.required], // Default value for authorId
      topSlateId: [1, Validators.required], // Default value for topSlateId
    });
  }

  onSubmit() {
    if (this.formGroup.valid) {
      const newContest: Contest = this.formGroup.value;
      if (environment.ianConfig.showLogs) console.log('Submitting new contest', newContest);
      this.ballotStore.addContest(newContest);
      this.closeNewContestEditor.emit(false);
    }
  }
  cancel() {
    this.closeNewContestEditor.emit(false);
  }
}
