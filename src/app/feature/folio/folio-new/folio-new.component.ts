import { Component, inject, output } from '@angular/core';
import { FolioStore } from '../folio.store';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Folio } from '../../../shared/interfaces/interfaces';
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

  formGroup: FormGroup;
  closeNewFolioEditor = output<boolean>();

  constructor(private fb: FormBuilder) {
    this.formGroup = this.fb.group({
      folioName: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.formGroup.valid) {
      const newFolioPrep: Folio = this.formGroup.value;
      if (environment.ianConfig.showLogs) console.log('Submitting new folio', newFolioPrep);
      const newFolio: Folio = {
        ...newFolioPrep,
        isDefault: false,
        authorId: '',
        folioName: newFolioPrep.folioName.trim(),
      };
      if (environment.ianConfig.showLogs) console.log('Submitting new folio', newFolio);
      this.folioStore.addFolio(newFolio);
      this.closeNewFolioEditor.emit(false);
      this.folioStore.toggleFolioAdder(false);
    }
  }
  cancel() {
    this.closeNewFolioEditor.emit(false);
    this.folioStore.toggleFolioAdder(false);
  }
}
