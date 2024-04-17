import { Component, Input } from '@angular/core';
import { file, folder } from '../../../entities/customElements';
import { FolderComponent } from '../folder/folder.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sub-folder',
  standalone: true,
  imports: [FolderComponent, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './sub-folder.component.html',
  styleUrl: './sub-folder.component.css'
})
export class SubFolderComponent {

  @Input() folder!: folder;

  ngOnChanges() {
  }

  /*@Input() folder!: folder;
  @Input() padding: number = 5;

  get name(): string {
    return this.isFile ? this.files[0].name : this.folder.folderName;
  }

  get files(): file[] {
    return this.isFile ? [] : this.folder.files;
  }

  get folders(): folder[] {
    return this.isFile ? [] : this.folder.folders;
  }

  get isOpen(): boolean {
    return this.isFile ? false : this.folder.isOpen;
  }

  get isFile(): boolean {
    return this.folder.hasOwnProperty('fileId');
  }

  selected() {
    console.log('Selected:', this.name);
  }*/
}
