import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { file, folder } from '../../entities/customElements';
import { ElementService } from '../element/element.service';
import { AuthService } from '../auth/auth.service';
import { Endpoints } from '../../constants/Endpoint';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FolderService {
  constructor(private el: ElementService, private authService: AuthService, private http: HttpClient) {
    this.folders.next([this.selectedFolder.value]);
    this.elementService = el;
    this.elementService.setFolderService(this);
  }

  token: string | null = this.authService.getToken();

  private elementService!: ElementService;
  content: BehaviorSubject<any> = new BehaviorSubject<any>({});
  count: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  selectedFile: BehaviorSubject<file | null> = new BehaviorSubject<file | null>(null);
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

  getTemplateByuserName(userName: string) {
    const body = {
      "Token": this.token,
      "DataStoreId": Endpoints.forumTemplatesDataStoreId,
      "Operation": "read",
      "Data": `select * from form_templates where username like '${userName}'`,
      "Encrypted": "1951",
    }
    return this.http.post(Endpoints.dataops, body).pipe(
      map((response: any) => {
        return response
      })
    );
  }

  saveTemplate(file: file, username: string) {
    console.log()
    const body = {
      "Token": this.token,
      "DataStoreId": Endpoints.forumTemplatesDataStoreId,
      "Operation": "insert",
      "Data": `insert into form_templates (username, name, content) values ('${username}', '${file.name}', '${file.content}')`,
      "Encrypted": "1951",
    }
    return this.http.post(Endpoints.dataops, body).pipe(
      map((response: any) => {
        return response.message
      })
    );
  }
}