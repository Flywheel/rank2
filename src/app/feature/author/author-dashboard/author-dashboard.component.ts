import { Component, inject } from '@angular/core';
import { AuthorStore } from '../author.store';

@Component({
  selector: 'mh5-author-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './author-dashboard.component.html',
  styleUrl: './author-dashboard.component.scss',
})
export class AuthorDashboardComponent {
  authorStore = inject(AuthorStore);
}
