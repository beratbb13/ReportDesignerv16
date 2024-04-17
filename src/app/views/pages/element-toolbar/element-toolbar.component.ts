import { Component, ViewChild } from '@angular/core';
import { CdkDragDrop, CdkDropList, CdkDragPreview, CdkDrag, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { ElementService } from '../../../services/element/element.service';
import { button, checkbox, combobox, htmlTemplate, image, label, link, listbox, radioButton, table, textarea, textbox } from '../../../entities/customElements';
import { MainEditorComponent } from '../main-editor/main-editor.component';
import { FolderService } from '../../../services/folder/folder.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-element-toolbar',
  standalone: true,
  imports: [CdkDropList, CdkDrag, CdkDragPreview, FormsModule, CommonModule],
  templateUrl: './element-toolbar.component.html',
  styleUrl: './element-toolbar.component.css'
})
export class ElementToolbarComponent {

  editorProperties: any = {};
  draggable: boolean = false;
  constructor(private elementService: ElementService, private folderService: FolderService) {
    this.folderService.content.asObservable().subscribe(res => this.editorProperties = res);


    this.folderService.selectedFile.asObservable().subscribe(res => {
      if (res.fileId != 0)
        this.draggable = true;
    })
  }

  searchBar: string = '';
  filteredElements: any[] = [];

  search() {
    this.filteredElements = this.elements.filter(el => {
      let lowerBase = el.label.toLocaleLowerCase();
      return lowerBase.includes(this.searchBar.toLocaleLowerCase())
    })
  }

  elements: htmlTemplate[] = [
    {
      label: 'Label', icon: 'assets/label.png', element: {
        text: 'label_1',
        fontSize: 14,
        fontColor: 'black'
      } as label, style: {
        width: 100,
        height: 25
      }, isDragDisabled: false
    },
    {
      label: 'Textbox', icon: 'assets/textbox.png',
      element: {
        text: 'textbox',
        fontSize: 14,
        fontColor: 'black',
        minLength: 0,
        maxLength: 100,
        readonly: false,
        required: false
      } as textbox, style: {
        width: 100,
        height: 25
      }, isDragDisabled: false
    },
    {
      label: 'Textarea', icon: 'https://www.svgrepo.com/show/345207/textarea.svg',
      element: {
        text: 'textarea',
        fontSize: 14,
        fontColor: 'black',
        minLength: 0,
        maxLength: 200,
        readonly: false,
        required: false
      } as textarea, style: {
        width: 100,
        height: 25
      }, isDragDisabled: false
    },
    /*{
      label: 'Table', icon: 'assets/table.png',
      element: {
        captions: {
          cells: ['Ad', 'Takma isim']
        },
        row: [
          { cells: ['Berat', 'bb13'] }, { cells: ['Çiftci'] }, { cells: ['Gelişim', 'Üniversitesi'] }
        ]
      } as table, style: {
        width: 250,
        height: 50
      }, isDragDisabled: false
    },*/
    {
      label: 'Combobox', icon: 'assets/combobox.png',
      element: {
        fontColor: 'red',
        fontSize: 14,
        options: [
          { value: 'Option 1', text: 'Option 1' },
          { value: 'Option 2', text: 'Option 2' },
          { value: 'Option 3', text: 'Option 3' },
        ]
      } as combobox, style: {
        width: 130,
        height: 40
      }, isDragDisabled: false
    },
    {
      label: 'Checkbox', icon: 'assets/checkbox.png', element: {
        text: 'checkbox',
        fontSize: 14,
        fontColor: 'red',
        readonly: false
      } as checkbox, style: {
        width: 100,
        height: 25
      }, isDragDisabled: false
    },
    {
      label: 'Radio Button', icon: 'assets/radio.png', element: {
        text: 'radio',
        fontSize: 15,
        fontColor: 'black'
      } as radioButton, style: {
        width: 100,
        height: 25
      }, isDragDisabled: false
    },
    {
      label: 'Image', icon: 'assets/image.png', element: {
        src: '',
        width: 100,
        height: 100
      } as image, style: {
        width: 100,
        height: 25
      }, isDragDisabled: false
    },
    {
      label: 'Link', icon: 'assets/link.png', element: {
        url: 'www.google.com'
      } as link, style: {
        width: 100,
        height: 25
      }, isDragDisabled: false
    },
    {
      label: 'Button', icon: 'assets/button.png', element: {
        text: 'button',
        disabled: false
      } as button, style: {
        width: 100,
        height: 25
      }, isDragDisabled: false
    },
    {
      label: 'Listbox', icon: 'assets/listbox.png', element: {
        fontColor: 'red',
        fontSize: 14,
        options: [
          { value: 'option1', text: 'option 1' },
          { value: 'option2', text: 'option 2' }
        ]
      } as listbox, style: {
        width: 100,
        height: 25
      }, isDragDisabled: false
    }
  ];

  addedElements: any[] = [];

  ngOnInit() {
    this.filteredElements = this.elements;
  }

  drop(event: CdkDragDrop<string[]>) {
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );

    let element = this.filteredElements[event.previousIndex];
    this.addElement(element, event);
  }

  addElement(element: any, event: CdkDragDrop<string[]>) {
    const newElement = { ...element };
    const newEvent = event.event as MouseEvent;

    let clientX = newEvent.clientX;
    let clientY = newEvent.clientY;
    let clientMaxWidth = element.style.width;
    let clientMaxHeight = element.style.height;

    let minX = this.editorProperties.x
    let minY = this.editorProperties.y
    let maxX = this.editorProperties.x + this.editorProperties.width;
    let maxY = this.editorProperties.y + this.editorProperties.height;

    if ((clientX + clientMaxWidth < maxX && clientX > minX) && (clientY + clientMaxHeight < maxY && clientY > minY)) {
      newElement['position'] = {
        x: newEvent.clientX,
        y: newEvent.clientY,
      }
      this.addedElements.push(newElement);
      this.elementService.addElement(newElement);
    }
  }
}
