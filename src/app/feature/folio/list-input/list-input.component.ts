import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'mh5-list-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list-input.component.html',
  styleUrl: './list-input.component.scss',
})
export class ListInputComponent {
  data: any[] = [];
  validationErrors: string[] = [];

  handlePaste(event: ClipboardEvent) {
    const pastedData = event.clipboardData?.getData('text') || '';
    this.data = this.parseData(pastedData);
  }

  parseData(pastedData: string): any[] {
    return pastedData.split('\n').map(row => {
      const columns = row.split('\t');
      return {
        FolioName: columns[0],
        MediaSource: columns[1],
        SourceId: columns[2],
        Caption: columns[3],
      };
    });
  }

  validateData() {
    this.validationErrors = [];
    this.data.forEach((row, index) => {
      if (!row.FolioName || !row.MediaSource || !row.SourceId || !row.Caption) {
        this.validationErrors.push(`Row ${index + 1}: Missing data`);
      }
      // Add more specific validation checks if needed
    });
  }
}
