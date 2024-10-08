import { Component, inject, output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Placement } from '../../../core/interfaces/interfaces';
import { FolioStore } from '../folio.store';
import { AuthorStore } from '../../author/author.store';

@Component({
  selector: 'mh5-folio-placement-new',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './folio-placement-new.component.html',
  styleUrl: './folio-placement-new.component.scss',
})
export class FolioPlacementNewComponent {
  authorStore = inject(AuthorStore);
  folioStore = inject(FolioStore);
  fb = inject(FormBuilder);

  formGroup: FormGroup = this.fb.group({
    caption: ['', Validators.required],
  });

  closeNewPlacementEditor = output<boolean>();

  onSubmit() {
    if (this.formGroup.valid) {
      const folioId = this.folioStore.folioViewSelected().id;
      const newPlacement: Placement = {
        id: 0,
        authorId: this.authorStore.authorLoggedIn().id,
        folioId,
        assetId: 1,
        caption: this.formGroup.value.caption,
      };

      this.folioStore.placementCreate(newPlacement);

      this.closeNewPlacementEditor.emit(false);
    }
  }
  cancel() {
    this.closeNewPlacementEditor.emit(false);
  }
}
