import { Component, inject, output } from '@angular/core';
import { FolioStore } from '../folio.store';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Folio } from '../../../core/interfaces/interfaces';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'mh5-folio-new',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './folio-new.component.html',
  styleUrl: './folio-new.component.scss',
})
export class FolioNewComponent {
  folioStore = inject(FolioStore);
  fb = inject(FormBuilder);
  formGroup: FormGroup = this.fb.group({
    folioName: ['', Validators.required],
  });
  closeNewFolioEditor = output<boolean>();

  onSubmit() {
    if (this.formGroup.valid) {
      const newFolioPrep: Folio = this.formGroup.value;
      if (environment.ianConfig.showLogs) console.log('Preparing folio', newFolioPrep.folioName);
      const newFolio: Folio = {
        ...newFolioPrep,
        isDefault: false,
        authorId: '',
        folioName: newFolioPrep.folioName.trim(),
      };
      if (environment.ianConfig.showLogs) console.log('Submitting new folio', newFolio);
      this.folioStore.folioCreate(newFolio);
      this.closeNewFolioEditor.emit(false);
      this.folioStore.toggleFolioAdder(false);
    }
  }
  cancel() {
    this.closeNewFolioEditor.emit(false);
    this.folioStore.toggleFolioAdder(false);
  }
}
