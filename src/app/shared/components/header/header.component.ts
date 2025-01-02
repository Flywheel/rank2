import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { IconCommunityComponent } from '@shared/svg/icon-community';
import { IconShareComponent } from '@shared/svg/icon-share';
import { IconProfileComponent } from '@shared/svg/icon-profile';
import { IconDashboardComponent } from '@shared/svg/icon-dashboard';
import { IconMhComponent } from '@shared/svg/icon-mh';

@Component({
  selector: 'mh5-header',
  standalone: true,
  imports: [IconMhComponent, IconCommunityComponent, IconShareComponent, IconProfileComponent, IconDashboardComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  router = inject(Router);
  callerPage = input.required<string>();
  caption = input<string>('Pitch');
  location = inject(Location);

  hidePlacementViewer = output<boolean>();

  openPage(page: string) {
    this.router.navigate([page]);
  }

  goBack() {
    this.location.back();
  }
}
