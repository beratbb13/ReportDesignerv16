import { Component, HostListener, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ElementToolbarComponent } from './views/pages/element-toolbar/element-toolbar.component';
import { TopBarComponent } from './views/pages/top-bar/top-bar.component';
import { MainEditorComponent } from './views/pages/main-editor/main-editor.component';
import { PropertiesComponent } from './views/pages/properties/properties.component';
import { FolderComponent } from './views/pages/folder/folder.component';
import { PreviewComponent } from './views/pages/preview/preview.component';
import { ElementService } from './services/element/element.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { FolderService } from './services/folder/folder.service';
import helloWorldCss from './views/pages/main-editor/main-editor.component.css'


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, ReactiveFormsModule, PreviewComponent, ElementToolbarComponent, TopBarComponent, MainEditorComponent, PropertiesComponent, FolderComponent, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {


  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    let result = this.mainEditorComponent.returnHelloWorldCss();
    console.log(result);
  }

  previewMode: boolean = false;

  @ViewChild(MainEditorComponent) mainEditorComponent!: MainEditorComponent;
  @ViewChild(TopBarComponent) topBarComponent!: TopBarComponent;
  constructor(private elementService: ElementService, private folderService: FolderService) {
    this.elementService.previewMode.asObservable().subscribe(res => {
      this.previewMode = res;
      if (res) {
        let file = this.folderService.selectedFile.getValue();
        if (file) {
          let elements = this.elementService.changedElements.getValue();
          file.content = JSON.stringify(elements);
          this.folderService.selectedFile.next(file);
        }
      }
    });
  }

  ngOnInit() {
    this.getSavedTemplate();
    this.getFolders();
    this.getSelectedFile();

    this.folderService.selectedFile.asObservable().subscribe(res => {
      if (res) {
        let selectedId = this.folderService.selectedFileId.getValue();
        this.mainEditorComponent.fileId = res.fileId;
        if (selectedId !== res.fileId) {
          this.mainEditorComponent.fileId = res.fileId;
          if (res?.content != null) {

            this.topBarComponent.exportEnabled = false;

            let contentWidth = this.mainEditorComponent.content.nativeElement.clientWidth;
            let contentHeight = this.mainEditorComponent.content.nativeElement.clientHeight;
            let contentX = this.mainEditorComponent.content.nativeElement.offsetLeft;
            let contentY = this.mainEditorComponent.content.nativeElement.offsetTop;

            JSON.parse(res.content).forEach((element: any) => {
              let changedWidth = (element.styleRelative.width) * contentWidth;
              let changedHeight = (element.styleRelative.height) * contentHeight;

              element.style.width = changedWidth;
              element.style.height = changedHeight;

              let changedX = contentX * element.positionRelative.x;//contentX + ((element.positionRelative.x) * contentX / 100);
              let changedY = contentY * element.positionRelative.y;//contentY + ((element.positionRelative.y) * contentY / 100);

              element.position = {
                x: changedX,
                y: changedY
              };

            });

            this.elementService.changedElements.next(JSON.parse(res.content));
          }
        }
      }
    });
  }


  getSelectedFile() {

  }

  getFolders() {
    this.folderService.getFoldersByuserName('beratbb13').subscribe(res => {
      if (res.result == true && res.message) {
        let response = res.message;

        const tree = this.buildTree(response);
        this.folderService.folders.next(tree);
      }
    });
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

  getSavedTemplate() {
    /*this.folderService.getTemplateByuserName('beratbb13').subscribe(res => {
      if (res.result == true && res.message) {
        if (res.message.length) {
          let response = res.message[0];
          this.folderService.selectedFile.next({ fileId: response.id, name: response.name, content: response.content, isSelected: false })
        }
      }
    });*/
  }

  goBackEdit() {
    this.elementService.previewMode.next(false);
    this.folderService.save.next(false);
  }

}
