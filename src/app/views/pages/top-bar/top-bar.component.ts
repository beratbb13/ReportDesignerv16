import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, ViewChild } from '@angular/core';
import { FolderService } from '../../../services/folder/folder.service';
import { file, folder } from '../../../entities/customElements';
import { SubFileComponent } from '../sub-file/sub-file.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogService } from '../../../services/dialog/dialog.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [SubFileComponent, CommonModule, ReactiveFormsModule, FormsModule, MatButtonModule, MatMenuModule],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TopBarComponent {

  @ViewChild('modal') modal!: ElementRef;
  @ViewChild('modal_second') modal_second!: ElementRef;
  @ViewChild(SubFileComponent) subFileComponent!: SubFileComponent;

  folders: folder[] = [];
  toggle: boolean = false;
  selectedFolder: folder = { id: -1, folderName: '', files: [], folders: [], isOpen: false }
  selectedFile: any = {};
  showFileCreator: boolean = false;
  newFileName: string = '';

  constructor(private folderService: FolderService, private dialogService: DialogService) {
    this.folderService.folders.asObservable().subscribe(res => this.folders = res);

    this.dialogService.isOpen.asObservable().subscribe(res => {
      if (res == true) {
        this.closeModal();
      }
    })

    this.folderService.selectedFolder.asObservable().subscribe(res => {
      if (res) {
        if (this.modal && this.modal_second) {
          this.modal.nativeElement.style.display = 'none';
          this.modal_second.nativeElement.style.display = 'flex';
          this.selectedFolder = res;
        }
      }
    });

    this.folderService.selectedFile.asObservable().subscribe(res => {
      if (res) {
        this.selectedFile = res;
      }
    })
  }

  isNew: boolean = false;
  modalHeader: string = '';

  openModal(boolean: boolean) {
    this.subFileComponent.count = 0;
    if (boolean) {
      this.modalHeader = 'Klasör Seçiniz';
    } else {
      this.modalHeader = "Dosya Seçiniz";
    }
    this.isNew = boolean;
    this.modal.nativeElement.style.display = 'block';
  }

  closeModal() {
    this.modal_second.nativeElement.style.display = 'none';
    this.modal.nativeElement.style.display = 'none';
    this.subFileComponent.count = 0;
    this.newFileName = '';
  }

  expand(folder: folder) {
    folder.isOpen = true;
    let folderElements = document.getElementsByClassName(folder.folderName);

    if (folderElements) {
      for (let i = 0; i < folderElements.length; i++) {
        let folderElement = folderElements.item(i);

        if (folderElement instanceof HTMLElement) {
          folderElement.style.display = 'block';
        }
      }
    }
  }

  paddingLeftStart: number = 5;

  collapse(folder: folder) {
    folder.isOpen = false;
    let folderElements = document.getElementsByClassName(folder.folderName);

    if (folderElements) {
      for (let i = 0; i < folderElements.length; i++) {
        let folderElement = folderElements.item(i);

        if (folderElement instanceof HTMLElement) {
          folderElement.style.display = 'none';
        }
      }
    }
  }

  selectedFileId!: number;

  toggleSelection(file: file) {
    file.isSelected = !file.isSelected;
  }

  crateNewFile() {
    const newFile: file = {
      fileId: 15,
      name: this.newFileName,
      content: `[]`,
      isSelected: false
    }

    this.selectedFolder.files.push(newFile);
    this.folderService.selectedFolder.next(this.selectedFolder);
    this.folderService.selectedFile.next(newFile);
    this.selectedFileId = newFile.fileId;
    this.closeModal();
  }


  /*findFile(folder: folder) {
    let founded = this.folders.filter(folder => {
      return folder.files = folder.files.filter(file => file.fileId == this.selectedFileId);
    });
    if (founded.length == 0) {
      return null;
    } else {
      return founded[0];
    }
  }*/

  printFilesInFolders(folder: any, indentation = 0) {
    console.log(' '.repeat(indentation * 4) + folder.folderName);

    if (folder.files) {
      for (const file of folder.files) {
        console.log(' '.repeat((indentation + 1) * 4) + file.name);
      }
    }

    if (folder.folders) {
      for (const subfolder of folder.folders) {
        this.printFilesInFolders(subfolder, indentation + 1);
      }
    }
  }

  confirmSelection() {
    if (this.selectedFileId != null || this.selectedFileId != undefined) {
      this.closeModal();
    }
  }

  isDropdownOpen = false;

  onToggle(): void {
    this.isDropdownOpen = !this.isDropdownOpen;

    if (this.isDropdownOpen) {
    } else {
    }
  }

  saveChanges() {
    this.folderService.saveFile();
  }

}