import { Component } from '@angular/core';
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

  constructor(private elementService: ElementService, private folderService: FolderService) {
    this.elementService.previewMode.asObservable().subscribe(res => {
      this.previewMode = res;
    });
  }

  ngOnInit() {
    this.getSavedTemplate();
  }

  getSavedTemplate() {
    this.folderService.getTemplateByuserName('beratbb13').subscribe(res => {
      if (res.result == true && res.message) {
        if (res.message.length) {
          let response = res.message[0];
          this.folderService.selectedFile.next({ fileId: response.id, name: response.name, content: response.content, isSelected: false })
        }
      }
    });
  }

  goBackEdit() {
    this.elementService.previewMode.next(false);
    this.folderService.save.next(false);
  }

}
