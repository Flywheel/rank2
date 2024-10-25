import { Component, computed, inject, input, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PitchStore } from '../../pitch/pitch.store';
import { Pitch } from '../../../core/models/interfaces';
import { environment } from '../../../../environments/environment';
import { AuthorStore } from '../../author/author.store';
import { FolioStore } from '../folio.store';

@Component({
  selector: 'mh5-pitch-new',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './pitch-new.component.html',
  styleUrl: './pitch-new.component.scss',
})
export class PitchNewComponent {
  authorStore = inject(AuthorStore);
  folioStore = inject(FolioStore);
  pichStore = inject(PitchStore);

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
      title: [this.folioStore.folioViewSelected().folioName, Validators.required],
      description: [this.folioStore.folioViewSelected().folioName, Validators.required],
      opens: [today, Validators.required],
      closes: [nextWeekDate, Validators.required],
      authorId: [this.authorStore.authorLoggedIn().id, Validators.required],
      folioId: [this.folioStore.folioIdSelected(), Validators.required],
    });
  }

  onSubmit() {
    if (this.formGroup.valid) {
      const newContest: Pitch = this.formGroup.value;
      if (environment.ianConfig.showLogs) console.log('Submitting new contest', newContest);
      this.pichStore.pitchCreate(newContest);
      this.closeNewPitchEditor.emit(false);
    }
  }
  cancel() {
    //this.pichStore.togglePitchAdder(false);
    this.closeNewPitchEditor.emit(false);
  }
}
