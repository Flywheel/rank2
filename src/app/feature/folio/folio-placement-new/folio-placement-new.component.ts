import { Component, inject, output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Placement } from '../../../core/interfaces/interfaces';
import { FolioStore } from '../folio.store';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'mh5-folio-placement-new',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './folio-placement-new.component.html',
  styleUrl: './folio-placement-new.component.scss',
})
export class FolioPlacementNewComponent {
  folioStore = inject(FolioStore);
  fb = inject(FormBuilder);
  //form: FormGroup;

  formGroup: FormGroup = this.fb.group({
    folioName: ['', Validators.required],
  });

  closeNewPlacementEditor = output<boolean>();

  // constructor(private fb: FormBuilder) {
  //   this.form = this.fb.group({
  //     caption: ['', Validators.required],
  //   });
  // }

  onSubmit() {
    if (this.formGroup.valid) {
      const folioId = this.folioStore.currentFolioView().id;
      const newPlacement: Placement = {
        id: 0,
        authorId: '',
        folioId,
        assetId: 1,
        caption: this.formGroup.value.caption,
      };
      if (environment.ianConfig.showLogs) {
        console.log(`Submitting new placement for ${this.folioStore.currentFolioView().id}`);
        console.log(newPlacement);
      }
      this.folioStore.addPlacement(newPlacement);
      console.log('allPlacements', this.folioStore.allPlacements());
      this.folioStore.setCurrentFolioView(folioId);

      if (environment.ianConfig.showLogs) console.log(this.folioStore.currentFolioView().placementViews);
      this.closeNewPlacementEditor.emit(false);
    }
  }
  cancel() {
    this.closeNewPlacementEditor.emit(false);
  }
}
