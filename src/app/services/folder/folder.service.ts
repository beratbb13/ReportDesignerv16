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
    this.elementService = el;
    this.elementService.setFolderService(this);
  }

  token: string | null = this.authService.getToken();

  private elementService!: ElementService;
  content: BehaviorSubject<any> = new BehaviorSubject<any>({});
  count: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  selectedFile: BehaviorSubject<file | null> = new BehaviorSubject<file | null>(null);
  selectedFileId: BehaviorSubject<number | null> = new BehaviorSubject<number | null>(null);
  tempSelectedFile: BehaviorSubject<file | null> = new BehaviorSubject<file | null>(null);
  tempSelectedFolder: BehaviorSubject<folder | null> = new BehaviorSubject<folder | null>(null);
  selectedFolder: BehaviorSubject<folder | null> = new BehaviorSubject<folder | null>(null);
  folders: BehaviorSubject<folder> = new BehaviorSubject<folder>({
    id: 0,
    folderName: 'Main',
    files: [],
    folders: [],
  });
  save: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  addFileByFolderId(folderId: number, fileName: string, username: string = 'beratbb13') {
    const body = {
      "Token": this.token,
      "DataStoreId": Endpoints.formFilesDataStoreId,
      "Operation": "read",
      "Data": `insert into form_files (pid, name, cuser, isFile) values ('${folderId}', '${fileName}', '${username}', true) returning id, pid, name, cuser, content`,
      "Encrypted": "1951",
    }
    return this.http.post(Endpoints.dataops, body).pipe(
      map((response: any) => {
        return response.message;
      })
    );
  }

  addFolderByFolderIdAndUsername(fileName: string, folderId: number, username: string) {
    const body = {
      "Token": this.token,
      "DataStoreId": Endpoints.formFilesDataStoreId,
      "Operation": "read",
      "Data": `insert into form_files (pid, name, cuser, isFile) values ('${folderId}', '${fileName}', '${username}', false) returning id, pid, name, cuser`,
      "Encrypted": "1951",
    }
    return this.http.post(Endpoints.dataops, body).pipe(
      map((response: any) => {
        return response.message;
      })
    );
  }

  getFoldersByuserName(userName: string) {
    const body = {
      "Token": this.token,
      "DataStoreId": Endpoints.formFilesDataStoreId,
      "Operation": "read",
      "Data": `select id, pid, name, cuser, isFile, content from form_files where cuser like '${userName}'`,
      "Encrypted": "1951",
    }
    return this.http.post(Endpoints.dataops, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getTemplateByFileId(fileId: number) {
    const body = {
      "Token": this.token,
      "DataStoreId": Endpoints.formTemplatesDataStoreId,
      "Operation": "read",
      "Data": `select id, fileid, username, name, content from form_templates where fileid = ${fileId}`,
      "Encrypted": "1951",
    }
    return this.http.post(Endpoints.dataops, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  getTemplateByuserName(userName: string) {
    const body = {
      "Token": this.token,
      "DataStoreId": Endpoints.formTemplatesDataStoreId,
      "Operation": "read",
      "Data": `select id, fileid, username, name, content from form_templates where username like '${userName}'`,
      "Encrypted": "1951",
    }
    return this.http.post(Endpoints.dataops, body).pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  saveTemplate(file: any, username: string) {
    const body = {
      "Token": this.token,
      "DataStoreId": Endpoints.formTemplatesDataStoreId,
      "Operation": "upsert",
      "Data": `update form_files set content = '${file.content}' where id = ${file.id} and cuser like '${username}'`,
      "Encrypted": "1951",
    }
    return this.http.post(Endpoints.dataops, body).pipe(
      map((response: any) => {
        return response.message;
      })
    );
  }
}