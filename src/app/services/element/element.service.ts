import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { file, htmlTemplate } from '../../entities/customElements';
import { FolderService } from '../folder/folder.service';

@Injectable({
  providedIn: 'root'
})
export class ElementService {

  private folderService!: FolderService;

  setFolderService(service2: FolderService) {
    this.folderService = service2;
  }

  //constructor(private folderService: FolderService) { }

  selectedElement: BehaviorSubject<any> = new BehaviorSubject<any>({});
  elements: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  private id: number = 1;

  addElement(element: any): void {
    const currentElements = this.elements.value;
    element['id'] = this.id++;
    currentElements.push(element);
    this.elements.next(currentElements);
  }

  saveLayout() {
    let file!: file;
    this.folderService.selectedFile.asObservable().subscribe(res => {
      file = res;
    })
    this.elements.asObservable().subscribe((data) => {
      if (file)
        file.content = JSON.stringify(data);
    });

    if (file)
      this.folderService.selectedFile.next(file);
  }

  setSelectedElement(elementRef: any) {
    let selected: any;
    this.selectedElement.asObservable().subscribe(res => {
      selected = res;
    })
    selected.element = elementRef;
    this.selectedElement.next(selected);
  }

  removeElement() {
    let elements = this.elements.getValue();
    let selected = this.selectedElement.getValue();
    let filteredElements = elements.filter(e => e.id !== selected.id);

    this.elements.next(filteredElements);
    this.selectedElement.next(null);
  }
}
