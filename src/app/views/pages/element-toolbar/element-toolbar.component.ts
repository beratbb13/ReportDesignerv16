import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { CdkDragDrop, CdkDropList, CdkDragPreview, CdkDrag, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { ElementService } from '../../../services/element/element.service';
import { FolderService } from '../../../services/folder/folder.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-element-toolbar',
  standalone: true,
  imports: [CdkDropList, CdkDrag, CdkDragPreview, FormsModule, CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './element-toolbar.component.html',
  styleUrl: './element-toolbar.component.css',
  schemas: [NO_ERRORS_SCHEMA]
})
export class ElementToolbarComponent {

  editorProperties: any = {};
  draggable: boolean = false;
  searchBar: string = '';
  filteredElements: any[] = [];
  addedElements: any[] = [];
  elements: any[] =
    [
      {
        name: 'Label',
        tag: 'label',
        icon: 'fa-solid fa-tag',// 'assets/label.png',
        attributes: {
          value: 'label',
        }
      },
      {
        name: 'Textbox',
        tag: 'input',
        icon: 'fa-solid fa-text-width',//'assets/textbox.png',
        attributes: {
          type: 'text',
          value: '',
          disabled: false,
          readonly: false,
          autofocus: false,
          required: false,
          minlength: 0,
          maxlength: 100,
          placeholder: '',
        }
      },
      {
        name: 'Image',
        tag: 'img',
        icon: 'fa-solid fa-image',//'assets/image.png',
        attributes: {
          src: '',
          alt: '',
          loading: 'auto',
          decoding: 'auto',
        }
      },
      {
        name: 'Selectbox',
        tag: 'select',
        icon: 'fa-solid fa-list',// 'assets/combobox.png',
        options: [],
        attributes: {
          disabled: false,
          multiple: false,
        }
      },
      {
        name: 'Button',
        tag: 'button',
        icon: 'fa-solid fa-play', // 'assets/button.png',
        attributes: {
          value: 'Button',
          type: 'submit',
          disabled: false,
        }
      },
      {
        name: 'Checkbox',
        icon: 'fa-solid fa-square-check',//'assets/checkbox.png',
        tag: 'input',
        attributes: {
          type: 'checkbox',
          value: 'checkbox',
          disabled: false,
          name: 'name'
        }
      },
      {
        name: 'Radio',
        tag: 'input',
        icon: 'fa-regular fa-circle-dot',// 'assets/radio.png',
        attributes: {
          type: 'radio',
          value: 'radio',
          disabled: false,
          name: 'name'
        }
      }
    ];

  constructor(private elementService: ElementService, private folderService: FolderService) {
    this.folderService.content.asObservable().subscribe(res => this.editorProperties = res);

    this.folderService.selectedFile.asObservable().subscribe(res => {
      if (res.fileId != 0)
        this.draggable = true;
    });
  }

  search() {
    this.filteredElements = this.elements.filter(el => {
      let lowerBase = el.name.toLocaleLowerCase();
      return lowerBase.includes(this.searchBar.toLocaleLowerCase())
    })
  }

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
    let clientMaxWidth = 150;//element.style.width;
    let clientMaxHeight = 35;//element.style.height;

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
