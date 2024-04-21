import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { file, folder } from '../../entities/customElements';
import { ElementService } from '../element/element.service';
import { debug } from 'console';

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
  tempSelectedFolder: BehaviorSubject<folder | null> = new BehaviorSubject<folder | null>(null);

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


  addFolderByFolderId(folderId: number, newFolder: folder) {

    let folders = this.folders.getValue();
    let stat: boolean = true;

    folders.forEach(folder => {
      if (folder.id === folderId) {
        folder.folders.push(newFolder);
        return;
      } else {
        if (folder.folders.length) {
          folder.folders.forEach(subFolder => {
            if (subFolder.id === folderId) {
              subFolder.folders.push(newFolder);
              return;
            }
          })
        }
      }
    });

    this.folders.next(folders);
    return stat;
  }
}
