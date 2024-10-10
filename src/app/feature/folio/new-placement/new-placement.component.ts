import { Component, computed, inject, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Placement, PlacementView } from '../../../core/models/interfaces';
import { AuthorStore } from '../../author/author.store';
import { FolioStore } from '../folio.store';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { MediaPlatform } from '../../../core/models/mediatypes';
import { DomSanitizer } from '@angular/platform-browser';
import { placementViewInit } from '../../../core/models/initValues';

@Component({
  selector: 'mh5-new-placement',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, FormsModule],
  templateUrl: './new-placement.component.html',
  styleUrl: './new-placement.component.scss',
})
export class NewPlacementComponent {
  authorStore = inject(AuthorStore);
  folioStore = inject(FolioStore);
  fb = inject(FormBuilder);

  formGroup: FormGroup = this.fb.group({
    caption: ['', Validators.required],
  });

  radioOption = signal('textEntry');

  closeNewPlacementEditor = output<boolean>();
  emptyPlatform = {} as MediaPlatform;
  parsedMedia = signal<MediaPlatform>(this.emptyPlatform);
  allowViewerDisplay = computed(() => this.sourecIdLocator() !== 'unknown' && this.sourecIdLocator() !== '');

  sanitizer = inject(DomSanitizer);
  // mediaService = inject(MediaService);
  // mediaURL = computed(() => this.mediaService.parseMedia(this.contentEntityView()));
  // contentPlayer = computed(() => this.sanitizer.bypassSecurityTrustResourceUrl(this.mediaURL()[0]));
  contentPlayer = computed(() => 't');
  closeEditor = output<void>();
  caption = signal<string>('');
  isCaptionHere = computed<boolean>(() => this.caption().length >= 6);
  paddingBottom = '56.25%';

  addToPitchChecked = signal<boolean>(false);

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

      this.folioStore.togglePlacementAdder(false);
      this.closeNewPlacementEditor.emit(false);
    }
  }
  cancel() {
    this.folioStore.togglePlacementAdder(false);
    this.closeNewPlacementEditor.emit(false);
  }

  allowPost = computed(
    () => true
    // (this.parsedMedia().platformType === undefined && this.isTextOrMediaOption() === 'Media') ||
    // (this.selectedTextOrMediaOption() === 'textEntry' && this.caption().length < 6)
  );

  async onSubmitPlacement() {
    // const contentId = await this.getContentId();
    // const topicMember = this.createTopicMember(contentId);
    // await this.topicStore.addTopicMember(topicMember);
    // if (this.addToPitchChecked()) {
    //   const slateMember = this.createSlateMember();
    //   await this.pitchStore.addSlateMembersToPitch([slateMember]);
    // }
    // this.refreshView();
    // // this.closeEditor.emit();
  }

  clearContainer() {
    // this.caption.set('');
    // this.parsedMedia.set(this.emptyPlatform);
    // this.contentEntityView.set(this.contentEntityEmpty);
    (document.getElementById('urlAdder') as HTMLTextAreaElement).value = '';
  }

  sourecIdLocator = computed(() => {
    // const platform = this.parsedMedia();
    // switch (platform.platformType) {
    //   case 'youtube':
    //     return platform.id;
    //   case 'tiktok':
    //     return platform.videoId;
    //   case 'instagram':
    //     return platform.id;
    //   case 'twitter':
    //     return platform.statusId;
    //   case 'textinput':
    //     return platform.theInput;
    //   // Add other platforms as needed
    //   default:
    //     return 'unknown';
    // }
    return 'unknown';
  });

  onPaste(event: ClipboardEvent): void {
    const text = event.clipboardData?.getData('text') || '';
    this.parseInput(text);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const text = event.dataTransfer?.getData('text') || '';
    this.parseInput(text);
  }
  onInput(event: Event) {
    const text = (event.target as HTMLInputElement).value;
    this.parseInput(text);
  }

  contentEntityView = signal<PlacementView>(placementViewInit);
  private parseInput(input: string) {
    console.log('Input=', input);
    // this.parsedMedia.set(this.emptyPlatform);
    // console.log('Input=', input);
    // for (const [key, value] of Object.entries(this.platforms)) {
    //   const match = value.regex.exec(input);
    //   if (match) {
    //     const result = value.parse(match);
    //     if (result !== null) this.parsedMedia.set(result);
    //     if (this.logger.enabled) console.log(`${key}: ${this.parsedMedia().platformType} ${this.sourecIdLocator()}  ${JSON.stringify(result)}`);
    //   } else {
    //     if (this.logger.enabled) console.log('No match for ', key, ' in ', value);
    //   }
    // }
    // this.refreshView();
  }

  refreshView() {
    //   const contentTypeId = this.contentStore.contentTypes().find((t) => t.name === this.parsedMedia().platformType)?.id ?? 0;
    //   const newContent: ContentView = {
    //     id: 0,
    //     caption: this.caption(),
    //     contentType: { id: contentTypeId, name: this.parsedMedia().platformType },
    //     sourceId: this.sourecIdLocator(),
    //     topicId: this.topic().id ?? 0,
    //     topicMemberId: this.contentStore.newestContent().id,
    //     author: this.loggedInAuthorProfile(),
    //   };
    //   this.contentEntityView.update(() => newContent);
    //   if (this.logger.enabled) console.log(`${this.logger.logDT()}refreshedView=', this.contentEntityView()`);
  }
}
