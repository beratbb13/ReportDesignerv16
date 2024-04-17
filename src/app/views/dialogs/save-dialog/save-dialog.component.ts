import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-save-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './save-dialog.component.html',
  styleUrl: './save-dialog.component.css'
})
export class SaveDialogComponent {

}
