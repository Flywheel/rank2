import { Component, inject, output, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Folio, Placement } from '../../../core/interfaces/interfaces';
import { FolioStore } from '../folio.store';
import { AuthorStore } from '../../author/author.store';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'mh5-folio-placement-new',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './folio-placement-new.component.html',
  styleUrl: './folio-placement-new.component.scss',
})
export class FolioPlacementNewComponent {
  authorStore = inject(AuthorStore);
  folioStore = inject(FolioStore);
  fb = inject(FormBuilder);
  radioOption = signal('Caption Only');

  formGroup: FormGroup = this.fb.group({
    caption: ['', Validators.required],
  });

  closeNewPlacementEditor = output<boolean>();

  onSubmit() {
    const parentFolioId = this.folioStore.folioViewSelected().id;
    const authorId = this.authorStore.authorLoggedIn().id;
    switch (this.radioOption()) {
      case 'Caption Only':
        if (this.formGroup.valid) {
          const newPlacement: Placement = {
            id: 0,
            authorId,
            folioId: parentFolioId,
            assetId: 1,
            caption: this.formGroup.value.caption,
          };
          this.folioStore.placementCreate(newPlacement);
          this.folioStore.togglePlacementAdder(false);
        }
        break;

      case 'Folio':
        if (this.formGroup.valid) {
          const folioData: Partial<Folio> = {
            folioName: this.formGroup.value.caption.trim(),
            authorId: this.authorStore.authorLoggedIn().id,
          };
          this.folioStore.folioCreateWithParent(folioData, parentFolioId);
          this.folioStore.toggleFolioAdder(false);
        }
        break;
    }
    this.formGroup.controls['caption'].reset();
  }

  cancel() {
    this.folioStore.togglePlacementAdder(false);

    this.closeNewPlacementEditor.emit(false);
  }
  test() {
    if (environment.ianConfig.showLogs) {
      console.log(this.folioStore.allComputedFolioViews());
      console.log(this.authorStore.authorLoggedInView());
    }
  }
}
