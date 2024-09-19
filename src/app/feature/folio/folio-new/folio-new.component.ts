import { Component, inject, output } from '@angular/core';
import { FolioStore } from '../folio.store';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LogService } from '../../../core/log/log.service';
import { Folio } from '../../../core/interfaces/interfaces';

@Component({
  selector: 'mh5-folio-new',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './folio-new.component.html',
  styleUrl: './folio-new.component.scss',
})
export class FolioNewComponent {
  folioStore = inject(FolioStore);
  logger = inject(LogService);
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
      if (this.logger.enabled) console.log('Submitting new folio', newFolioPrep);
      const newFolio: Folio = {
        ...newFolioPrep,
        isDefault: false,
        authorId: 1,
        folioName: newFolioPrep.folioName.trim(),
      };
      if (this.logger.enabled) console.log('Submitting new folio', newFolio);
      this.folioStore.addFolio(newFolio);
      this.closeNewFolioEditor.emit(false);
    }
  }
  cancel() {
    this.closeNewFolioEditor.emit(false);
  }
}
