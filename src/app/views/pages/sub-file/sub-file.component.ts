import { Component, Input } from '@angular/core';
import { file, folder } from '../../../entities/customElements';
import { FolderComponent } from '../folder/folder.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FolderService } from '../../../services/folder/folder.service';
import { DialogService } from '../../../services/dialog/dialog.service';

@Component({
  selector: 'app-sub-file',
  standalone: true,
  imports: [FolderComponent, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './sub-file.component.html',
  styleUrl: './sub-file.component.css'
})
export class SubFileComponent {

  constructor(private folderService: FolderService, private dialogService: DialogService) {
  }

  @Input() folder!: folder;
  @Input() paddingLeft: any;
  @Input() toggle: boolean = false;
  @Input() showFiles: boolean = false;

  public count: number = 0;

  ngOnChanges() {
    this.count++
  }

  selected(file: file) {
    this.folderService.selectedFile.next(file);
    this.folderService.selectedFile.asObservable().subscribe((value) => { /*console.log(value) */ });
    this.dialogService.isOpen.next(true);
  }

  chooseFolder(folder: folder | null) {
    if (folder)
      this.folderService.selectedFolder.next(folder);
  }

}
