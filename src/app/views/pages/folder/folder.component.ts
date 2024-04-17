import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FolderService } from '../../../services/folder/folder.service';
import { folder } from '../../../entities/customElements';
import { tap } from 'rxjs';
import { SubFileComponent } from '../sub-file/sub-file.component';

@Component({
  selector: 'app-folder',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, SubFileComponent],
  templateUrl: './folder.component.html',
  styleUrl: './folder.component.css',
})
export class FolderComponent {

  paddingLeftStart: number = 5;
  @Input() folders: folder[] = [];
  toggle: boolean = false;

  constructor(private folderService: FolderService) {
    this.folderService.folders.asObservable().pipe(
      tap(res => {
        this.folders = res;
      }),
    ).subscribe(() => { /*console.log(this.folders)*/ });
  }

  selected(element: any) {
    //console.log(element);
  }

}
