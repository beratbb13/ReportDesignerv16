import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ElementToolbarComponent } from './views/pages/element-toolbar/element-toolbar.component';
import { TopBarComponent } from './views/pages/top-bar/top-bar.component';
import { MainEditorComponent } from './views/pages/main-editor/main-editor.component';
import { PropertiesComponent } from './views/pages/properties/properties.component';
import { FolderComponent } from './views/pages/folder/folder.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ElementToolbarComponent, TopBarComponent, MainEditorComponent, PropertiesComponent, FolderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ReportDesignerv16';
}
