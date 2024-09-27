import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ShareService {
  isWebShareSupported(): boolean {
    return !!navigator.share;
  }
  async share(text: string, url: string) {
    if (this.isWebShareSupported()) {
      try {
        await navigator.share({
          title: 'Mini Herald Preference Polls ',
          text: text,
          url: url,
        });
        console.log('Content shared successfully');
      } catch (err) {
        console.error('Error sharing content:', err);
      }
    } else {
      alert('Web Share API is not supported in your browser.');
    }
  }
}
