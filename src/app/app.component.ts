import { Component, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule, ReactiveFormsModule, PreviewComponent, ElementToolbarComponent, TopBarComponent, MainEditorComponent, PropertiesComponent, FolderComponent, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  previewMode: boolean = false;

  @ViewChild(MainEditorComponent) mainEditorComponent!: MainEditorComponent;
  constructor(private elementService: ElementService, private folderService: FolderService) {
    this.elementService.previewMode.asObservable().subscribe(res => {
      this.previewMode = res;
    });
  }

  ngOnInit() {
    this.getSavedTemplate();
    this.getFolders();
    this.getSelectedFile();
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
