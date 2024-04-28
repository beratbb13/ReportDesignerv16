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
    this.folderService.tempSelectedFolder.asObservable().subscribe(res => this.tempSelectedFolder = res?.folderName);
  }

  @Input() folder!: folder;
  @Input() paddingLeft: number = 0;
  @Input() toggle: boolean = false;
  @Input() showFiles: boolean = false;
  @Input() tempSelectedFolder: string | undefined = undefined;

  public count: number = 0;

  ngOnChanges() {
    this.count++
  }

  selected(file: file) {
    //this.folderService.tempSelectedFile.next(file);
    this.folderService.selectedFile.next(file);
    this.folderService.selectedFileId.next(file.fileId);
    //this.folderService.selectedFile.asObservable().subscribe((value) => { /*console.log(value) */ });
    this.dialogService.isOpen.next(true);
  }

  chooseFolder(folder: folder | null) {
    if (folder)
      this.folderService.selectedFolder.next(folder);
    this.tempSelectedFolder = undefined;
  }

  selectFolder() {
    this.folderService.tempSelectedFolder.next(this.folder);
  }

  /*selectFile(file: file) {
    this.folderService.selectedFile.next(file);
    this.tempSelectedFolder = undefined;
  }*/

}
