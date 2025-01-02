import { Component, computed, effect, ElementRef, inject, input, output, signal, viewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Asset, AssetType, AssetView, Folio, Pitch, Placement } from '@shared/models/interfaces';
import { FolioStore } from '@feature/folio/folio.store';
import { AuthorStore } from '@feature/author/author.store';
import { environment } from 'src/environments/environment';
import { MediaService } from '@shared/services/media.service';
import { FolioPlacementMediaComponent } from '../folio-placement-media/folio-placement-media.component';
import { assetViewInit } from '@shared/models/initValues';
import { PitchStore } from '@feature/pitch/pitch.store';

@Component({
  selector: 'mh5-folio-placement-new',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, FolioPlacementMediaComponent],
  templateUrl: './folio-placement-new.component.html',
  styleUrl: './folio-placement-new.component.scss',
})
export class FolioPlacementNewComponent {
  authorStore = inject(AuthorStore);
  pitchStore = inject(PitchStore);
  folioStore = inject(FolioStore);
  fb = inject(FormBuilder);

  formGroup: FormGroup;

  forcePopup = input<boolean>(false);
  showPopup = computed<boolean>(() => this.forcePopup());
  AssetTypeEnum = AssetType;
  assetType = input.required<AssetType>();

  newMedia = signal(false);

  captionField = viewChild<ElementRef<HTMLInputElement>>('captionField');
  closeNewPlacementEditor = output<boolean>();

  constructor() {
    effect(() => {
      this.captionField()?.nativeElement.focus();
    });
    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextWeekDate = nextWeek.toISOString().split('T')[0];

    this.formGroup = this.fb.group({
      authorId: [this.authorStore.authorLoggedIn().id, Validators.required],
      folioId: [this.folioStore.folioIdSelected(), Validators.required],
      caption: ['', Validators.required],
      description: [''],
      opens: [today],
      closes: [nextWeekDate],
      urlAdder: [''],
    });
  }

  togglePitchValidators(isRequired: boolean): void {
    const controls = ['opens', 'closes', 'description'];

    controls.forEach(controlName => {
      const control = this.formGroup.get(controlName);
      if (control) {
        if (isRequired) {
          control.setValidators([Validators.required]);
        } else {
          control.clearValidators();
        }
        control.updateValueAndValidity();
      }
    });
  }

  async onSubmit() {
    const parentFolioId = this.folioStore.folioViewSelected().id;
    const authorId = this.authorStore.authorLoggedIn().id;
    if (environment.ianConfig.showLogs) console.log(this.assetType());

    switch (this.assetType()) {
      case AssetType.Folio:
        if (this.formGroup.valid) {
          const folioData: Partial<Folio> = {
            folioName: this.formGroup.value.caption.trim(),
            authorId: this.authorStore.authorLoggedIn().id,
            parentFolioId,
          };
          this.folioStore.createBranchFolio(folioData);
          this.folioStore.toggleFolioAdder(false);
        }
        break;
      case AssetType.Placement:
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
            const assetPrep: Asset = {
              id: 0,
              mediaType: this.assetViewPrepared().mediaType,
              sourceId: this.assetViewPrepared().sourceId,
              authorId: this.authorStore.authorLoggedIn().id,
            };
            //this.folioStore.createPlacementWithAsset(parentFolioId, newPlacement.caption, assetPrep);
            this.folioStore.createPlacementWithAssetRX({ folioId: parentFolioId, caption: newPlacement.caption, assetPrep: assetPrep });
          } else this.folioStore.createPlacement(newPlacement);
          this.folioStore.togglePlacementAdder(false);
        }
        break;
      case AssetType.Pitch:
        if (this.formGroup.valid) {
          const pitchPrepInit = {
            authorId,
            folioId: parentFolioId,
            name: this.formGroup.value.caption,
            description: this.formGroup.value.description,
            opens: this.formGroup.value.opens,
            closes: this.formGroup.value.closes,
          };
          const pitchPrep = pitchPrepInit as unknown as Pitch;

          const { newPitch } = await this.pitchStore.createPitchAndSlate(pitchPrep);

          const assetPrep: Asset = {
            id: 0,
            mediaType: 'pitch',
            sourceId: newPitch.id.toLocaleString(),
            authorId: this.authorStore.authorLoggedIn().id,
          };
          //this.folioStore.createPlacementWithAsset(parentFolioId, this.formGroup.value.caption, assetPrep);
          this.folioStore.createPlacementWithAssetRX({
            folioId: parentFolioId,
            caption: this.formGroup.value.caption,
            assetPrep: assetPrep,
          });
          this.folioStore.togglePlacementAdder(false);
        }
        break;
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
    const assetInit = this.mediaService.castUrlToAsset(input);
    console.log(assetInit);
    this.assetViewPrepared.set(assetInit);
  }

  test() {
    if (environment.ianConfig.showLogs) {
      console.log(this.folioStore.placementViewsComputed());
      console.log(this.folioStore.folioViewsComputed());
      console.log(this.authorStore.authorLoggedInView());
    }
  }
}
