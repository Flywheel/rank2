import { Component, computed, inject, input, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContestStore } from '../../contest/contest.store';
import { Pitch } from '../../../core/models/interfaces';
import { environment } from '../../../../environments/environment';
import { AuthorStore } from '../../author/author.store';

@Component({
  selector: 'mh5-contest-new',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './contest-new.component.html',
  styleUrl: './contest-new.component.scss',
})
export class ContestNewComponent {
  authorStore = inject(AuthorStore);
  pichStore = inject(ContestStore);

  formGroup: FormGroup;
  closeNewPitchEditor = output<boolean>();

  forcePopup = input<boolean>(false);
  showPopup = computed<boolean>(() => this.forcePopup());

  constructor(private fb: FormBuilder) {
    const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7); // Set date to one week from today
    const nextWeekDate = nextWeek.toISOString().split('T')[0]; // Get next week's date in YYYY-MM-DD format

    this.formGroup = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      opens: [today, Validators.required],
      closes: [nextWeekDate, Validators.required],
      authorId: [this.authorStore.authorLoggedIn().id, Validators.required],
      folioId: [this.authorStore.authorSelectedView().authorFolio.id, Validators.required],
    });
  }

  onSubmit() {
    if (this.formGroup.valid) {
      const newContest: Pitch = this.formGroup.value;
      // if (environment.ianConfig.showLogs) console.log('Submitting new contest', newContest);
      this.pichStore.contestAddWithSlate(newContest);
      this.closeNewPitchEditor.emit(false);
    }
  }
  cancel() {
    //this.pichStore.togglePitchAdder(false);
    this.closeNewPitchEditor.emit(false);
  }
}
