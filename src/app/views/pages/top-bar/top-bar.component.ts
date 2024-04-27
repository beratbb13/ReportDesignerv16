import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, ViewChild } from '@angular/core';
import { FolderService } from '../../../services/folder/folder.service';
import { file, folder } from '../../../entities/customElements';
import { SubFileComponent } from '../sub-file/sub-file.component';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogService } from '../../../services/dialog/dialog.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { ElementService } from '../../../services/element/element.service';
import { concatMap } from 'rxjs';

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
  @ViewChild('previewModal') previewModal!: ElementRef;
  @ViewChild(SubFileComponent) subFileComponent!: SubFileComponent;

  folders: folder[] = [];
  toggle: boolean = false;
  selectedFolder: folder = { id: -1, folderName: '', files: [], folders: [] }
  selectedFile: any = {};
  showFileCreator: boolean = false;
  newFileName: string = '';

  constructor(private folderService: FolderService, private dialogService: DialogService, private elementService: ElementService, private fb: FormBuilder) {
    this.folderService.folders.asObservable().subscribe(res => {
      if (res != null)
        this.folders = [res]
    });

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

    /*this.folderService.selectedFile.asObservable().subscribe(res => {
      if (res) {
        this.selectedFile = res;
      }
    });*/
  }

  isNew: boolean = false;
  modalHeader: string = '';
  previewForm!: FormGroup;

  ngOnInit() {
    this.previewForm = this.fb.group({
      prevcontrols: this.fb.array([])
    });
  }

  get prevcontrols(): FormArray {
    return this.previewForm.get('prevcontrols') as FormArray;
  }

  openModal(boolean: boolean) {
    this.subFileComponent.count = 0;
    if (boolean) {
      this.modalHeader = 'Choose a folder';
    } else {
      this.modalHeader = "Choose a file";
    }
    this.isNew = boolean;
    this.modal.nativeElement.style.display = 'block';
  }

  enteredFolderName: string = '';
  buttonInnerHtml: any = {
    id: 0,
    text: 'Add new folder',
    inActive: false
  }

  enteredFolderNameChanged() {
    if (this.enteredFolderName.length > 0) {
      this.buttonInnerHtml = {
        id: 1,
        text: 'Confirm',
        inActive: false
      }

      let isUnique: boolean = true;
      this.folders.forEach(folder => {
        if (folder.folderName === this.enteredFolderName) {
          isUnique = false;
          return;
        }
        folder.folders.forEach(subfolder => {
          if (subfolder.folderName === this.enteredFolderName) {
            isUnique = false;
            return;
          }
        })
        folder.files.forEach(file => {
          if (file.name === this.enteredFolderName) {
            isUnique = false;
            return;
          }
        });
      });

      if (!isUnique) {
        this.buttonInnerHtml.inActive = true;
      }

    } else {
      this.buttonInnerHtml = {
        id: 0,
        text: 'Add new folder',
        inActive: false
      };

    }

  }

  isShouldBeCreated: boolean = false;

  checkNewFileName() {

    let isUnique: boolean = true;
    this.folders.forEach(folder => {
      if (folder.folderName === this.newFileName) {
        isUnique = false;
        return;
      }
      folder.folders.forEach(subfolder => {
        if (subfolder.folderName === this.newFileName) {
          isUnique = false;
          return;
        }
      })
      folder.files.forEach(file => {
        if (file.name === this.newFileName) {
          isUnique = false;
          return;
        }
      });
    });

    if (!isUnique) {
      this.isShouldBeCreated = false;
    } else {
      this.isShouldBeCreated = true;
    }
  }

  closeModal() {
    this.modal_second.nativeElement.style.display = 'none';
    this.modal.nativeElement.style.display = 'none';
    this.subFileComponent.count = 0;
    this.newFileName = '';
    this.folderService.tempSelectedFolder.next(null);
    this.message = { id: 0, text: '' };
    this.buttonInnerHtml = {
      id: 0,
      text: 'Add new folder',
      inActive: false
    }
    this.enteredFolderName = '';
    this.dialogService.isOpen.next(false);
  }

  expand(folder: folder) {
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

  paddingLeftStart: number = 2;

  collapse(folder: folder) {
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
    this.folderService.addFileByFolderId(this.selectedFolder.id, this.newFileName).subscribe(res => {
      let addedFile = res[0];
      this.selectedFolder.files.push(addedFile);
      this.folderService.selectedFile.next(addedFile);
    });
    this.closeModal();
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
    let elements = this.elementService.changedElements.getValue();
    let file: file | null = this.folderService.selectedFile.getValue();
    let stringify: string = ''
    if (elements.length)
      stringify = JSON.stringify(elements);
    if (stringify.length > 10 && file !== null) {
      file.content = stringify;
      this.folderService.saveTemplate({ content: stringify, id: file.fileId }, 'beratbb13')
        .subscribe(res => {
          //if (res.result == true && res.message == 'Success') {
          let mainFolder = this.folderService.folders.getValue();
          if (file !== null) {
            let foundedStat = this.updateFile(mainFolder, file);

            if (foundedStat) {
              if (this.foundedFolderIndex === 0) {
                mainFolder.files[this.foundedFileIndex] = file;
                this.folderService.folders.next(mainFolder);
              } else {
                mainFolder.folders[this.foundedFolderIndex].files[this.foundedFileIndex] = file;
                this.folderService.folders.next(mainFolder);
              }
            } else if (!foundedStat) {
              console.log('dosya bulunamadı');
            }

            this.foundedFolderIndex = -1;
            this.foundedFileIndex = -1;
          }
          //}
        });
    }
  }

  showOnPreview() {
    this.folderService.save.next(true);
    this.elementService.previewMode.next(true);
  }

  getFormControlKey(formGroup: AbstractControl): string {
    return Object.keys(formGroup.value)[0];
  }

  getFormControlValue(formGroup: AbstractControl): FormControl {
    return formGroup.get(Object.keys(formGroup.value)[0]) as FormControl;
  }

  getFormControlValue_(controlId: string): any {
    const control = this.prevcontrols.controls.find(c => c.value.id === controlId);
    return control ? control.value.value : null;
  }

  message: any = { id: 0, text: '' };

  checkTempSelectedFolder() {
    if (this.buttonInnerHtml.id === 0) {
      this.buttonInnerHtml.inActive = false;
      let folder = this.folderService.tempSelectedFolder.getValue();
      if (folder === null) {
        this.message.text = 'Firstly you must choose a folder path';
      } else {
        this.message = {
          id: 1,
          text: folder.folderName
        };
      }
    } else if (this.buttonInnerHtml.id === 1 && this.buttonInnerHtml.inActive === false) {
      let folder = this.folderService.tempSelectedFolder.getValue();
      if (folder !== null)
        this.folderService.addFolderByFolderIdAndUsername(this.enteredFolderName, folder.id, 'beratbb13').pipe(
          concatMap(file => {
            return file;
          })
        ).subscribe((res: any) => {
          if (res.id) {
            let folders = this.folderService.folders.getValue();
            this.findAndAddFolderOrFile(folders, res, false);
            this.folderService.folders.next(folders);
            this.closeModal();
          }
        });
    }
  }

  foundedFolderIndex: number = -1;
  foundedFileIndex: number = -1;

  updateFile(folder: folder, file: file | null) {
    if (file === null)
      return null;
    this.foundedFolderIndex += 1;
    this.foundedFileIndex = -1;
    for (let innerFile of folder.files) {
      if (innerFile.fileId == file.fileId) {
        this.foundedFileIndex += 1;
        return true;
      }
    }
    folder.folders.forEach(subFolder => {
      this.updateFile(subFolder, file);
    });
    return false;
  }

  findAndAddFolderOrFile(folder: any, res: any, isFile: boolean) {
    if (folder.id === res.pid) {
      if (isFile) {
        folder.files.push({ fileId: res.id, name: res.name, pid: res.pid, content: '' });
      } else {
        folder.folder.push({ id: res.id, folderName: res.name, pid: res.pid, folders: [], files: [] });
      }
      return true;
    }
    for (let subFolder of folder.folders) {
      if (this.findAndAddFolderOrFile(subFolder, res, isFile)) {
        return true;
      }
    }
    return false;
  }
}
