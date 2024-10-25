import { Component, inject } from '@angular/core';
import { AuthorStore } from '../author.store';
import { HeaderComponent } from '../../../core/header/header.component';

@Component({
  selector: 'mh5-author-dashboard',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './author-dashboard.component.html',
  styleUrl: './author-dashboard.component.scss',
})
export class AuthorDashboardComponent {
  authorStore = inject(AuthorStore);
}
