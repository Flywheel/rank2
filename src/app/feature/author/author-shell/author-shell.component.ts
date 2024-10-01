import { Component } from '@angular/core';
import { HeaderComponent } from '../../../core/header/header.component';
import { AuthorProfileComponent } from '../author-profile/author-profile.component';

@Component({
  selector: 'mh5-author-shell',
  standalone: true,
  imports: [HeaderComponent, AuthorProfileComponent],
  templateUrl: './author-shell.component.html',
  styleUrl: './author-shell.component.scss',
})
export class AuthorShellComponent {}
