import { Component, computed, inject, input, output, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Asset, AssetView, Folio, Placement } from '../../../core/models/interfaces';
import { FolioStore } from '../folio.store';
import { AuthorStore } from '../../author/author.store';
import { environment } from '../../../../environments/environment';
import { MediaService } from '../../../core/services/media.service';
import { FolioPlacementMediaComponent } from '../folio-placement-media/folio-placement-media.component';
import { assetViewInit } from '../../../core/models/initValues';
import { PitchNewComponent } from '../pitch-new/pitch-new.component';
import { ListInputComponent } from '../list-input/list-input.component';

@Component({
  selector: 'mh5-folio-placement-new',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, FolioPlacementMediaComponent, PitchNewComponent, ListInputComponent],
  templateUrl: './folio-placement-new.component.html',
  styleUrl: './folio-placement-new.component.scss',
})
export class FolioPlacementNewComponent {
  authorStore = inject(AuthorStore);
  folioStore = inject(FolioStore);
  fb = inject(FormBuilder);

  forcePopup = input<boolean>(false);
  showPopup = computed<boolean>(() => this.forcePopup());
  assetType = input.required<string>();

  newMedia = signal(false);
  newPlacment = signal(false);
  newFolio = signal(false);
  newPitch = signal(false);

  formGroup: FormGroup = this.fb.group({
    caption: ['', Validators.required],
    urlAdder: [''],
  });

  closeNewPlacementEditor = output<boolean>();

  onSubmit() {
    const parentFolioId = this.folioStore.folioViewSelected().id;
    const authorId = this.authorStore.authorLoggedIn().id;
    if (environment.ianConfig.showLogs) console.log(this.assetType());

    switch (this.assetType()) {
      case 'Placement':
        this.folioStore.togglePlacementAdder(true);
        if (this.formGroup.valid) {
          const newPlacement: Placement = {
            id: 0,
            authorId,
            folioId: parentFolioId,
            assetId: 1,
            caption: this.formGroup.value.caption,
          };

          if (this.newMedia()) {
            const media: Asset = {
              id: 0,
              mediaType: this.assetViewPrepared().mediaType,
              sourceId: this.assetViewPrepared().sourceId,
              authorId: this.authorStore.authorLoggedIn().id,
            };
            this.folioStore.assetCreateWithPlacement(media, this.formGroup.value.caption);
          } else this.folioStore.placementCreate(newPlacement);
          this.folioStore.togglePlacementAdder(false);
        }
        break;

      case 'Folio':
        if (this.formGroup.valid) {
          const folioData: Partial<Folio> = {
            folioName: this.formGroup.value.caption.trim(),
            authorId: this.authorStore.authorLoggedIn().id,
            parentFolioId,
          };
          this.folioStore.folioCreateWithParent(folioData);
          this.folioStore.toggleFolioAdder(false);
        }
        break;
      // case 'MediaUrl':
      //   if (this.formGroup.valid) {
      //     this.folioStore.togglePlacementAdder(true);
      //     const media: Asset = {
      //       id: 0,
      //       mediaType: this.assetViewPrepared().mediaType,
      //       sourceId: this.assetViewPrepared().sourceId,
      //       authorId: this.authorStore.authorLoggedIn().id,
      //     };
      //     this.folioStore.assetCreateWithPlacement(media, this.formGroup.value.caption);
      //     this.folioStore.togglePlacementAdder(false);
      //   }
      //   break;
    }
    this.formGroup.controls['caption'].reset();
  }

  cancel() {
    this.folioStore.togglePlacementAdder(false);
    this.closeNewPlacementEditor.emit(false);
  }

  onPaste(event: ClipboardEvent): void {
    const text = event.clipboardData?.getData('text') || '';
    this.displayMedia(text);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const text = event.dataTransfer?.getData('text') || '';
    this.displayMedia(text);
    this.formGroup.get('urlAdder')?.setValue(text);
  }
  onInput(event: Event) {
    const text = (event.target as HTMLInputElement).value;
    this.displayMedia(text);
  }

  mediaService = inject(MediaService);

  assetViewPrepared = signal<Asset | AssetView>(assetViewInit);
  displayMedia(input: string) {
    this.assetViewPrepared.set(this.mediaService.castUrlToAsset(input));
  }

  test() {
    if (environment.ianConfig.showLogs) {
      console.log(this.folioStore.placementViewsComputed());
      console.log(this.folioStore.folioViewsComputed());
      console.log(this.authorStore.authorLoggedInView());
    }
  }
}
