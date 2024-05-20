import { Component, HostListener, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ElementToolbarComponent } from './views/pages/element-toolbar/element-toolbar.component';
import { TopBarComponent } from './views/pages/top-bar/top-bar.component';
import { MainEditorComponent } from './views/pages/main-editor/main-editor.component';
import { PropertiesComponent } from './views/pages/properties/properties.component';
import { PreviewComponent } from './views/pages/preview/preview.component';
import { ElementService } from './services/element/element.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FolderService } from './services/folder/folder.service';
import { of, tap } from 'rxjs';
import { file, folder } from './entities/customElements';
import { TemplatesComponent } from './views/pages/templates/templates.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, ReactiveFormsModule, TemplatesComponent, PreviewComponent, ElementToolbarComponent, TopBarComponent, MainEditorComponent, PropertiesComponent, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  @ViewChild(MainEditorComponent) mainEditorComponent!: MainEditorComponent;
  @ViewChild(PreviewComponent) previewComponent!: PreviewComponent;
  @ViewChild(TopBarComponent) topBarComponent!: TopBarComponent;
  previewMode: boolean = false;

  onExport() {
    let result = this.previewComponent.returnInnerHTML();
    console.log(result);
  }

  constructor(private elementService: ElementService, private folderService: FolderService) {
    this.elementService.previewMode.asObservable().subscribe(res => {
      this.previewMode = res;
      if (res) {
        let file = this.folderService.selectedFile.getValue();
        if (file) {
          let elements = this.elementService.changedElements.getValue();
          file.content = JSON.stringify(elements);
          this.folderService.selectedFile.next(file);
          if (elements.length === 0) {
            this.topBarComponent.exportDisabled = true;
          } else {
            this.topBarComponent.exportDisabled = false;
          }
        }
      }
    });

    this.folderService.getFormHtml.asObservable().subscribe(res => {
      if (res) {
        this.elementService.previewMode.next(true);
        setTimeout(() => {
          this.onExport();
        }, 500);
      }
    });

  }

  ngOnInit() {
    this.getFolders();

    this.folderService.selectedFile.asObservable().subscribe(res => {
      if (res !== null) {
        let selectedId = this.folderService.selectedFileId.getValue();
        this.mainEditorComponent.fileId = res.fileId;
        if (selectedId !== res.fileId) {
          this.mainEditorComponent.fileId = res.fileId;
          if (res?.content != null) {
            let contentWidth = this.mainEditorComponent.content.nativeElement.clientWidth;
            let contentHeight = this.mainEditorComponent.content.nativeElement.clientHeight;
            let contentX = this.mainEditorComponent.content.nativeElement.offsetLeft;
            let contentY = this.mainEditorComponent.content.nativeElement.offsetTop;

            JSON.parse(res.content).forEach((element: any) => {
              if (element.styleRelative.width && element.styleRelative.height) {

                let changedWidth = (element.styleRelative.width) * contentWidth;
                let changedHeight = (element.styleRelative.height) * contentHeight;

                element.style.width = changedWidth;
                element.style.height = changedHeight;

                let changedX = contentX * element.positionRelative.x; //contentX + ((element.positionRelative.x) * contentX / 100);
                let changedY = contentY * element.positionRelative.y; //contentY + ((element.positionRelative.y) * contentY / 100);

                element.position = {
                  x: changedX,
                  y: changedY
                };
              }
            });

            this.elementService.changedElements.next(JSON.parse(res.content));

            if (JSON.parse(res.content).length > 0)
              this.topBarComponent.exportDisabled = false;
          } else {
            this.elementService.changedElements.next([]);
          }

        }
      }
    });
  }
  savedTemplate: file | null = null;

  getFolders() {
    /*this.folderService.getExportedTemplateByUsername('beratbb13').pipe(
      tap(res => {
        if (res.result == true && res.message && res.message.length) {
          let response = res.message[0] as file;
          this.savedTemplate = response;
          this.folderService.selectedFile.next(response);
          return of(true);
        } else {
          return of(false);
        }
      })
    ).subscribe(res => {
    if (!res) {*/
    this.folderService.getFoldersByuserName('beratbb13').subscribe(res => {
      if (res.result == true && res.message) {
        let response = res.message;

        const tree = this.buildTree(response);
        this.folder = tree;
        this.filteredFolder = tree;
        this.relativePath = tree.folderName;
        this.folderService.folders.next(tree);
      }
    });


    /*}
  });*/
  }
  folder: folder | null = null;
  isopen: boolean = false;
  showOnPreview: boolean = false;
  filteredFolder: folder | null = null;
  relativePath: string = '';
  selectedFolder: folder | null = null;
  foundedFolderIndex: number = 0;

  go(folder: folder) {
    this.filteredFolder = folder;
    this.relativePath += '/' + folder.folderName;
  }

  goBack() {
    if (this.filteredFolder !== null && this.folder !== null) {
      let founded = this.findParentFolder(this.filteredFolder, this.folder.folders);
      if (founded !== null) {
        this.filteredFolder = founded;
        this.selectedFolder = null;
        let pathArray = this.relativePath.split('/');
        pathArray.pop();
        this.relativePath = pathArray.join('/');
      }
    }
  }

  goForward() {
    if (this.selectedFolder) {
      this.filteredFolder = this.selectedFolder;
      this.relativePath += '/' + this.selectedFolder.folderName;
      this.selectedFolder = null;
    }
  }

  selectFolder(folder: folder) {
    this.selectedFolder = folder;
  }

  findIndex(id: number) {
    if (this.folder !== null) {
      let index = this.folder.folders.findIndex(folder => folder.id === id);
    }
  }

  findParentFolder(folder: folder, folders: folder[]): folder | null {
    if (folder.pid === null) {
      return null;
    }

    if (folder.pid === this.folder?.id) {
      return this.folder;
    }

    for (let i = 0; i < folders.length; i++) {
      if (folders[i].id === folder.pid) {
        return folders[i];
      }
      const parentFolder = this.findParentFolder(folder, folders[i].folders);
      if (parentFolder !== null) {
        return parentFolder;
      }
    }

    return null;
  }




  buildTree(files: any[]) {
    const rootFolders: any[] = [];
    const foldersMap = new Map<number, any>();

    files.filter(file => file.isfile === 0).forEach(folder => {
      const newFolder = { id: folder.id, pid: folder.pid, folderName: folder.name, files: [], folders: [] };
      foldersMap.set(folder.id, newFolder);
      if (folder.pid === null) {
        rootFolders.push(newFolder);
      }
    });

    files.filter(file => file.isfile === 1).forEach(file => {
      const parentFolder = foldersMap.get(file.pid);
      if (parentFolder) {
        parentFolder.files.push({ fileId: file.id, pid: file.pid, name: file.name, content: file.content });
      }
    });

    foldersMap.forEach(folder => {
      const parentFolder = foldersMap.get(folder.pid);
      if (parentFolder) {
        parentFolder.folders.push(folder);
      }
    });

    return rootFolders[0];
  }

  goBackEdit() {
    this.elementService.previewMode.next(false);
    this.folderService.save.next(false);
  }
}
