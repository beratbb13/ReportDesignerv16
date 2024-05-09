import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, ViewChild } from '@angular/core';
import { FolderService } from '../../../services/folder/folder.service';
import { file, folder } from '../../../entities/customElements';
import { SubFileComponent } from '../sub-file/sub-file.component';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogService } from '../../../services/dialog/dialog.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { ElementService } from '../../../services/element/element.service';
import { concatMap, of } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpService } from '../../../services/http/http.service';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [SubFileComponent, CommonModule, ReactiveFormsModule, FormsModule, MatButtonModule, MatMenuModule, MatSelectModule
    , MatFormFieldModule, MatInputModule
  ],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TopBarComponent {

  @ViewChild('modal') modal!: ElementRef;
  @ViewChild('modal_second') modal_second!: ElementRef;
  @ViewChild('previewModal') previewModal!: ElementRef;
  @ViewChild('exportModal') exportModal!: ElementRef;
  @ViewChild(SubFileComponent) subFileComponent!: SubFileComponent;
  folders: folder[] = [];
  toggle: boolean = false;
  selectedFolder: folder = { id: -1, folderName: '', files: [], folders: [] }
  selectedFile: any = {};
  showFileCreator: boolean = false;
  newFileName: string = '';
  isNew: boolean = false;
  modalHeader: string = '';
  previewForm!: FormGroup;
  exportForm!: FormGroup;
  exportDisabled: boolean = true;
  enteredFolderName: string = '';
  isShouldBeCreated: boolean = false;
  foundedFolderIndex: number = -1;
  foundedFileIndex: number = -1;
  message: any = { id: 0, text: '' };
  isDropdownOpen = false;
  selectedFileId: number | null = null;
  paddingLeftStart: number = 2;
  buttonInnerHtml: any = {
    id: 0,
    text: 'Add new folder',
    inActive: false
  }

  constructor(private httpService: HttpService, private folderService: FolderService, private dialogService: DialogService, private elementService: ElementService, private fb: FormBuilder) {
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

    this.selectedFileId = this.folderService.selectedFileId.getValue();
    this.selectedFile = this.folderService.selectedFile.getValue();
  }

  ngOnInit() {
    this.previewForm = this.fb.group({
      prevcontrols: this.fb.array([])
    });

    this.exportForm = this.fb.group({
      "name": ['', Validators.required],
      "appCode": ['', Validators.required],
      "icon": ['',],
      "applicationStatus": ['1', Validators.required],
      "description": ['',],
      "access": ['1', Validators.required],
      "applicationId": ['',],
      "domain": ['',],
      "owner": ['beratbb13',],
      "ownerId": ['',],
      "groups": [[],],
      "openerMethod": ['3', Validators.required],
      "applicationLink": ['',],
      "dashboards": [[],],
      "appType": ['1', Validators.required],
      "creationDate": ['',],
      "appCSS": ['',],
    });
  }

  get prevcontrols(): FormArray {
    return this.previewForm.get('prevcontrols') as FormArray;
  }

  closeExportModal() {
    this.exportModal.nativeElement.style.display = 'none';
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

  toggleSelection(file: file) {
    file.isSelected = !file.isSelected;
  }

  crateNewFile() {
    this.folderService.addFileByFolderId(this.selectedFolder.id, this.newFileName).subscribe(res => {
      let addedFile = res[0];
      this.selectedFolder.files.push(addedFile);
      this.folderService.selectedFile.next(addedFile);
      this.folderService.selectedFileId.next(addedFile.id);
    });
    this.closeModal();
  }

  confirmSelection() {
    if (this.selectedFileId != null || this.selectedFileId != undefined) {
      this.closeModal();
    }
  }

  onToggle(): void {
    this.isDropdownOpen = !this.isDropdownOpen;

    if (this.isDropdownOpen) {
    } else {
    }
  }

  saveChanges() {
    let elements = this.elementService.changedElements.getValue();
    let file: file | null = this.folderService.selectedFile.getValue();
    let fileId = this.folderService.selectedFileId.getValue();

    let content = this.folderService.content.getValue();

    elements.forEach(element => {
      let childLeft = element.position.x - content.x;
      let childTop = element.position.y - content.y;

      let childPercentageX = (((element.position.x - content.x) / content.width));//(childLeft / content.width) * 100;
      let childPercentageY = (((element.position.y - content.y) / content.height));//(childTop / content.height) * 100;

      element.styleRelative = {
        width: (element.style.width / content.width),
        height: (element.style.height / content.height),
      };

      element.positionRelative = {
        x: childPercentageX,
        y: childPercentageY
      };
    });

    let stringify: string = ''
    if (elements.length)
      stringify = JSON.stringify(elements);
    if (stringify.length > 10 && file !== null) {
      file.content = stringify;
      this.folderService.saveTemplate({ content: stringify, id: fileId }, 'beratbb13')
        .subscribe(res => {
          if (res.result == true && res.message == 'Success') {
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
          }
        });
    }
  }

  buildTree(files: any[]) {
    const rootFolders: any[] = [];
    const foldersMap = new Map<number, any>();

    // Klasörleri oluştur
    files.filter(file => file.isfile === 0).forEach(folder => {
      const newFolder = { id: folder.id, pid: folder.pid, folderName: folder.name, files: [], folders: [] };
      foldersMap.set(folder.id, newFolder);
      if (folder.pid === null) {
        rootFolders.push(newFolder);
      }
    });

    // Dosyaları klasörlere ekle
    files.filter(file => file.isfile === 1).forEach(file => {
      const parentFolder = foldersMap.get(file.pid);
      if (parentFolder) {
        parentFolder.files.push({ fileId: file.id, pid: file.pid, name: file.name, content: file.content });
      }
    });

    // Klasörleri alt klasör olarak ekle
    foldersMap.forEach(folder => {
      const parentFolder = foldersMap.get(folder.pid);
      if (parentFolder) {
        parentFolder.folders.push(folder);
      }
    });

    return rootFolders[0];
  }

  openExportTemplate() {
    this.exportModal.nativeElement.style.display = 'block';
  }

  exportTemplate() {
    let file = this.folderService.selectedFile.getValue();
    if (file != null) {
      debugger
      if (this.exportForm.valid) {
        if (file != null) {
          let fileId = file.fileId;
          this.httpService.addApplication(this.exportForm.value).pipe(
            concatMap((res) => {
              if (res.result == true && res.message) {
                return this.folderService.updateApplicationId(res.message, fileId);
              } else {
                return of(null);
              }
            }),
            concatMap((res) => {
              if (res.result == true && res.message) {
                return this.folderService.getFoldersByuserName('beratbb13');
              }
              return of(null);
            }),
          ).subscribe(res => {
            if (res.result = true && res.message) {
              let response = res.message;

              const tree = this.buildTree(response);
              this.folderService.folders.next(tree);
              this.folderService.getFormHtml.next(true);
              this.closeExportModal();
            }
          });
        }
      }
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

  updateFile(folder: folder, file: file | null) {
    if (file === null)
      return null;
    this.foundedFolderIndex += 1;
    this.foundedFileIndex = -1;
    for (let innerFile of folder.files) {
      this.foundedFileIndex += 1;
      if (innerFile.fileId === file.fileId) {
        return true;
      }
    }
    folder.folders.forEach(subFolder => {
      this.updateFile(subFolder, file);
    });
    return true;
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
