import { Component, input } from '@angular/core';
import { HeaderComponent } from '@shared/components/header/header.component';
import { BallotBodyComponent } from '@feature/ballot/ballot-body/ballot-body.component';
import { FooterComponent } from '@shared/components/footer/footer.component';

@Component({
  selector: 'mh5-ballot-shell',
  standalone: true,
  imports: [HeaderComponent, BallotBodyComponent, FooterComponent],
  templateUrl: './ballot-shell.component.html',
  styleUrl: './ballot-shell.component.scss',
})
export class BallotShellComponent {}
