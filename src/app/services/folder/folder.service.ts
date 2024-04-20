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
        files: [],
        folders: [],
        isOpen: true
      },
      {
        id: 22,
        folderName: 'Deneme_3',
        files: [],
        folders: [],
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
