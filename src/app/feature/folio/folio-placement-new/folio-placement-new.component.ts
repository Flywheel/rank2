import { Component, inject, output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Placement } from '../../../core/interfaces/interfaces';
import { LogService } from '../../../core/log/log.service';
import { FolioStore } from '../folio.store';

@Component({
  selector: 'mh5-folio-placement-new',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './folio-placement-new.component.html',
  styleUrl: './folio-placement-new.component.scss',
})
export class FolioPlacementNewComponent {
  folioStore = inject(FolioStore);
  logger = inject(LogService);
  form: FormGroup;
  closeNewPlacementEditor = output<boolean>();

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      caption: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const newPlacement: Placement = {
        id: 0,
        authorId: 1,
        folioId: this.folioStore.currentFolioView().id,
        assetId: 1,
        caption: this.form.value.caption,
      };
      if (this.logger.enabled) console.log('Submitting new placement', newPlacement);
      this.folioStore.addPlacement(newPlacement);
      this.folioStore.setCurrentFolioView2(this.folioStore.currentFolioView().id);
      if (this.logger.enabled) console.log(this.folioStore.currentFolioView().placementViews);
      this.closeNewPlacementEditor.emit(false);
    }
  }
  cancel() {
    this.closeNewPlacementEditor.emit(false);
  }
}
