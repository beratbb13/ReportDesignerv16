import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ElementService {

  elements: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  changedElements: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  selectedElement: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  previewMode: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  addElement(element: any): void {
    const currentElements = this.changedElements.getValue();
    const uuid = this.generateUUID();
    element['id'] = uuid;

    if (element.name == 'Input') {
      element['style'] = {
        width: 150,
        height: 30,
        fontSize: 12,
        color: 'black',
        backgroundColor: '',
        fontWeight: '',
        fontStyle: '',
        textDecoration: '',
        textAlign: 'left',
        border: '',
        borderRadius: 0,
        padding: 0,
      }
    } else if (element.name == 'Button') {
      element['style'] = {
        width: 150,
        height: 30,
        fontSize: 12,
        color: 'black',
        backgroundColor: '',
        fontWeight: '',
        fontStyle: '',
        textDecoration: '',
        textAlign: 'center',
        border: '',
        borderRadius: 0,
        padding: 0,
      }
    } else if (element.name == 'Image') {
      element['style'] = {
        width: 150,
        height: 30,
        border: '',
        borderRadius: 0,
      }
    } else if (element.name == 'Checkbox' || element.name == 'Radio') {
      element['style'] = {
        width: 100,
        height: 30,
        fontSize: 13,
        color: 'black',
        backgroundColor: '',
        fontWeight: '',
        fontStyle: '',
        textAlign: 'left',
        textDecoration: 'none'
      }
    } else if (element.name == 'Selectbox') {
      element['style'] = {
        width: 150,
        height: 30,
        fontSize: 14,
        color: 'black',
        backgroundColor: '',
        fontWeight: '',
        textAlign: '',
        fontFamily: 'Tahoma',
        padding: 0
      }
    } else if (element.name == 'Label') {
      element['style'] = {
        width: 150,
        height: 30,
        fontSize: 13,
        color: 'black',
        backgroundColor: '',
        fontWeight: '',
        fontStyle: '',
        textAlign: 'left',
        textDecoration: 'none'
      }
    } else
      element['style'] = {
        width: 150,
        height: 30,
        fontSize: 14,
        color: 'black',
        backgroundColor: '',
        fontWeight: '',
        fontStyle: '',
        textDecoration: '',
        textAlign: '',
        lineHeight: 0,
        letterSpacing: 0,
        fontFamily: 'Tahoma',
        border: '',
        borderRadius: 0,
        boxShadow: 0,
        margin: 0,
        padding: 0,
        display: '',
        overflow: 'hidden',
      }

    currentElements.push(element);
    this.changedElements.next(currentElements);
  }

  /*saveLayout() {
    let file!: file;
    let fileResponse = this.folderService.selectedFile.getValue();
    let dataResponse = this.elements.getValue();

    if (fileResponse) {
      file = fileResponse;
      file.content = JSON.stringify(dataResponse);
      this.folderService.selectedFile.next(file);
    }
    this.folderService.saveTemplate(file, 'beratbb13').subscribe(res => {
      console.log(res);
    })
  }*/

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

    this.changedElements.next(filteredElements);
    this.selectedElement.next(null);
  }
}
