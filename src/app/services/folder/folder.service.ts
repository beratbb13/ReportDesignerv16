import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { file, folder } from '../../entities/customElements';
import { ElementService } from '../element/element.service';

@Injectable({
  providedIn: 'root'
})
export class FolderService {

  private elementService!: ElementService;

  constructor(private el: ElementService) {
    this.folders.next([this.selectedFolder.value]);

    this.elementService = el;
    this.elementService.setFolderService(this);

  }


  content: BehaviorSubject<any> = new BehaviorSubject<any>({});
  count: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  selectedFile: BehaviorSubject<file> = new BehaviorSubject<file>({
    fileId: 0, name: '',
    content: '', isSelected: false
  });

  selectedFolder: BehaviorSubject<folder> = new BehaviorSubject<folder>({
    id: 0,
    folderName: 'Deneme',
    files: [],
    folders: [
      {
        id: 1,
        folderName: 'Deneme_2',
        files: [{
          fileId: 3, name: 'Üçüncü Template', content: `[
          {
            "id": 2,
            "label": "Label",
            "icon": "https://www.svgrepo.com/show/345207/textarea.svg",
            "element": {
              "text": "label_1",
              "fontSize": 14,
              "fontColor": "black"
            },
            "style": {
              "width": 100,
              "height": 25
            },
            "position": {
              "x": 350,
              "y": 270
            },
            "isDragDisabled": false
          },
          {
            "id": 3,
            "label": "Textbox",
            "icon": "https://www.svgrepo.com/show/345207/textarea.svg",
            "element": {
              "text": "textbox",
              "fontSize": 14,
              "fontColor": "black",
              "minLength": 0,
              "maxLength": 100,
              "readonly": false,
              "required": false
            },
            "style": {
              "width": 100,
              "height": 25
            },
            "position": {
              "x": 700,
              "y": 320
            },
            "isDragDisabled": false
          }
        ]` }],
        folders: [],
        isOpen: true
      },
      {
        id: 22,
        folderName: 'Deneme_3',
        files: [{
          fileId: 1, name: 'sekiz Template', content: `[
          {
            "id": 1,
            "label": "Label",
            "icon": "https://www.svgrepo.com/show/345207/textarea.svg",
            "element": {
              "text": "label_1",
              "fontSize": 14,
              "fontColor": "black"
            },
            "style": {
              "width": 100,
              "height": 25
            },
            "position": {
              "x": 400,
              "y": 220
            },
            "isDragDisabled": false
          },
          {
            "id": 4,
            "label": "Textbox",
            "icon": "https://www.svgrepo.com/show/345207/textarea.svg",
            "element": {
              "text": "textbox",
              "fontSize": 14,
              "fontColor": "black",
              "minLength": 0,
              "maxLength": 100,
              "readonly": false,
              "required": false
            },
            "style": {
              "width": 100,
              "height": 25
            },
            "position": {
              "x": 300,
              "y": 133
            },
            "isDragDisabled": false
          }
        ]` }],
        folders: [
          {
            id: 1,
            folderName: 'Deneme_4',
            files: [],
            folders: [],
            isOpen: true
          }
        ],
        isOpen: true
      }
    ],
    isOpen: true
  });

  createNewFile() {

  }


  folders: BehaviorSubject<folder[]> = new BehaviorSubject<folder[]>([]);

  save: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  saveFile() {
    this.save.next(true);
  }

}
