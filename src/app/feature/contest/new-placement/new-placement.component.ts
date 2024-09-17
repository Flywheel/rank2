import { Component, inject, output } from '@angular/core';
import { BallotStore } from '../../ballot/ballot.store';
import { LogService } from '../../../core/log/log.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Placement } from '../../../core/interfaces/interfaces';

@Component({
  selector: 'mh5-new-placement',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './new-placement.component.html',
  styleUrl: './new-placement.component.scss',
})
export class NewPlacementComponent {
  ballotStore = inject(BallotStore);
  logger = inject(LogService);
  form: FormGroup;
  closeNewPlacementEditor = output<boolean>();

  constructor(private fb: FormBuilder) {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7); // Set date to one week from today
    const nextWeekDate = nextWeek.toISOString().split('T')[0]; // Get next week's date in YYYY-MM-DD format

    this.form = this.fb.group({
      contestTitle: ['', Validators.required],
      contestDescription: ['', Validators.required],
      opens: [today, Validators.required],
      closes: [nextWeekDate, Validators.required],
      authorId: [1, Validators.required], // Default value for authorId
      topSlateId: [1, Validators.required], // Default value for topSlateId
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const newPlacement: Placement = this.form.value;
      if (this.logger.enabled) console.log('Submitting new contest', newPlacement);
      this.ballotStore.addPlacement(newPlacement);
      this.closeNewPlacementEditor.emit(false);
    }
  }
  cancel() {
    this.closeNewPlacementEditor.emit(false);
  }
}
