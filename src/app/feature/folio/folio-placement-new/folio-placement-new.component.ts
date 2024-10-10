import { Component, inject, output, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Asset, Folio, Placement } from '../../../core/interfaces/interfaces';
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
    switch (this.radioOption()) {
      case 'Caption Only':
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
          this.folioStore.togglePlacementAdder(false);
        }
        break;

      case 'Folio':
        if (this.formGroup.valid) {
          const folioData: Partial<Folio> = {
            folioName: this.formGroup.value.caption.trim(),
            authorId: this.authorStore.authorLoggedIn().id,
          };
          const parentFolioId = this.folioStore.folioViewSelected().id;

          this.folioStore.folioCreateWithParent(folioData, parentFolioId);

          this.folioStore.toggleFolioAdder(false);
        }
        break;
    }
    this.formGroup.controls['caption'].reset();
  }

  addTopic() {
    const newFolio: Folio = { id: 0, folioName: this.formGroup.value.caption, authorId: this.authorStore.authorLoggedIn().id, isDefault: false };
    this.folioStore.folioCreate(newFolio);

    const newAsset: Asset = {
      id: 0,
      mediaType: 'folio',
      sourceId: '0', // newFolio.id.toString(),
      authorId: this.authorStore.authorLoggedIn().id,
    };
    this.folioStore.assetCreate(newAsset);

    const placement: Placement = {
      id: 0,
      folioId: this.folioStore.folioViewSelected().id,
      caption: this.formGroup.value.caption,
      assetId: 0, // new placementId,
      authorId: this.authorStore.authorLoggedIn().id,
    };
    this.folioStore.placementCreate(placement);
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
