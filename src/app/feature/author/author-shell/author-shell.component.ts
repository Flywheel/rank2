import { Component } from '@angular/core';
import { HeaderComponent } from '@shared/components/header/header.component';
import { AuthorProfileComponent } from '../author-profile/author-profile.component';

@Component({
  selector: 'mh5-author-shell',
  standalone: true,
  imports: [HeaderComponent, AuthorProfileComponent],
  template: `<mh5-header callerPage="author" /><mh5-author-profile />`,
  styles: [],
})
export class AuthorShellComponent {}
