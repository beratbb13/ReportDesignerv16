import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { ElementService } from '../../../services/element/element.service';
import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DOCUMENT } from '@angular/common';
import { TextareaElementComponent } from '../../components/textarea-element/textarea-element.component';
import { ButtonElementComponent } from '../../components/button-element/button-element.component';
import { CheckboxElementComponent } from '../../components/checkbox-element/checkbox-element.component';
import { ComboboxElementComponent } from '../../components/combobox-element/combobox-element.component';
import { ImageElementComponent } from '../../components/image-element/image-element.component';
import { LabelElementComponent } from '../../components/label-element/label-element.component';
import { LinkElementComponent } from '../../components/link-element/link-element.component';
import { ListboxElementComponent } from '../../components/listbox-element/listbox-element.component';
import { OptionElementComponent } from '../../components/option-element/option-element.component';
import { RadioElementComponent } from '../../components/radio-element/radio-element.component';
import { TableElementComponent } from '../../components/table-element/table-element.component';
import { TextboxElementComponent } from '../../components/textbox-element/textbox-element.component';
import { FolderService } from '../../../services/folder/folder.service';
import { file } from '../../../entities/customElements';

export type ResizeDirectionType = 'x' | 'y' | 'xy' | 't' | 'l';

@Component({
  selector: 'app-main-editor',
  standalone: true,
  imports: [CdkDrag, FormsModule, CommonModule, TextareaElementComponent, ButtonElementComponent,
    CheckboxElementComponent, ComboboxElementComponent, ImageElementComponent, LabelElementComponent,
    LinkElementComponent, ListboxElementComponent, OptionElementComponent, RadioElementComponent,
    TableElementComponent, TextboxElementComponent, ReactiveFormsModule],
  templateUrl: './main-editor.component.html',
  styleUrl: './main-editor.component.css'
})
export class MainEditorComponent {

  @ViewChild('boundaryRef') boundaryElement!: ElementRef;
  @ViewChild('content') content!: ElementRef;
  @ViewChild('resizeCorner') resizeCornerRef!: ElementRef;

  minSize: { w: number; h: number } = { w: 100, h: 25 };
  elements: any[] = [];
  selectedElementId!: number;
  fileId: number = 0;
  isDragDisabled: boolean = false;

  constructor(
    private elementService: ElementService,
    private folderService: FolderService,
    @Inject(DOCUMENT) private _document: Document) {

    this.elementService.elements_.asObservable().subscribe(res => {
      this.elements = res;
    });

    this.folderService.selectedFolder.asObservable().subscribe(res => {
      if (res) {
        this.folderService.createNewFile();
      }
    })

    this.folderService.selectedFile.asObservable().subscribe(res => {
      if (res.fileId > 0) {
        this.fileId = res.fileId;
        this.createForm(res);
      } else {
        this.contentJSON = 'Choose a file';
      }
    })

    this.folderService.save.asObservable().subscribe(res => {
      if (res) {
        let isPreviewMode = this.elementService.previewMode.getValue();

        if (isPreviewMode) {

          let contentHeight = this.content.nativeElement.clientHeight;
          let contentWidth = this.content.nativeElement.clientWidth;
          let contentXStart = this.content.nativeElement.offsetLeft;
          let contentYStart = this.content.nativeElement.offsetTop;

          this.elements.forEach(element => {
            let elementX = element.position.x;
            let elementY = element.position.y;

            let relativeX = ((elementX - contentXStart) / contentWidth) * 100;
            let relativeY = ((elementY - contentYStart) / contentHeight) * 100;

            element.positionRelative = {
              x: relativeX,
              y: relativeY
            }

            let elementStyleWidth = parseFloat(element.style.width);
            let elementStyleHeight = parseFloat(element.style.height);

            let widthRatio = (elementStyleWidth / contentWidth) * 100;
            let heightRatio = (elementStyleHeight / contentHeight) * 100;

            element.styleRelative = {
              width: widthRatio,
              height: heightRatio
            }

          });

          this.elementService.selectedElement.next(null);

        } else {

          let contentHeight = this.content.nativeElement.clientHeight;
          let contentWidth = this.content.nativeElement.clientWidth;
          let contentXStart = this.content.nativeElement.offsetLeft;
          let contentYStart = this.content.nativeElement.offsetTop;

          this.elements.forEach(element => {
            let elementX = element.position.x;
            let elementY = element.position.y;

            let relativeX = ((elementX - contentXStart) / contentWidth) * 100;
            let relativeY = ((elementY - contentYStart) / contentHeight) * 100;

            element.positionRelative = {
              x: relativeX,
              y: relativeY
            }

            let elementStyleWidth = parseFloat(element.style.width);
            let elementStyleHeight = parseFloat(element.style.height);

            let widthRatio = (elementStyleWidth / contentWidth) * 100;
            let heightRatio = (elementStyleHeight / contentHeight) * 100;

            element.styleRelative = {
              width: widthRatio,
              height: heightRatio
            }

          });

          this.elementService.selectedElement.next(null);
          this.elementService.elements.next(this.elements);
          this.elementService.saveLayout();
        }
      }
    })
  }

  removeElement(event: MouseEvent, element: any) {
    event.preventDefault();
    let filtered = this.elements.filter(el => el.id !== element.id);
    this.elementService.elements_.next(filtered);
    this.elementService.selectedElement.next(null);

  }

  ngAfterViewInit() {
    this.folderService.content.next({
      x: this.content.nativeElement.offsetLeft, y: this.content.nativeElement.offsetTop,
      width: this.content.nativeElement.clientWidth, height: this.content.nativeElement.clientHeight
    })
  }

  onFocus(element: any) {
    this.elementService.selectedElement.next(element);
    this.selectedElementId = element.id;
  }

  onDragEnded(event: CdkDragEnd, elementRef: any): void {
    const dW = elementRef.position.x + event.distance.x;
    const dH = elementRef.position.y + event.distance.y;

    let screenX, screenY;

    if (event.event instanceof MouseEvent) {
      screenX = event.event.screenX;
      screenY = event.event.screenY;
    }

    let contentHeight = this.content.nativeElement.clientHeight;
    let contentWidth = this.content.nativeElement.clientWidth;
    let contentXStart = this.content.nativeElement.offsetLeft + elementRef.style.width;
    let contentYStart = this.content.nativeElement.offsetTop + elementRef.style.height;
    let contentXEnd = contentWidth + contentXStart - elementRef.style.width;
    let contentYEnd = contentHeight + contentYStart - elementRef.style.height;

    if ((dW > contentXStart && dW < contentXEnd) &&
      (dH > contentYStart && dH < contentYEnd)) {
      elementRef.position = {
        x: screenX,
        y: screenY
      };
    }

    let index = this.elements.findIndex(el => el.id === elementRef.id);
    if (index !== -1) {
      this.elements[index] = elementRef;
    }

    this.elementService.elements_.next(this.elements);
  }

  startResize(
    $event: any,
    direction: ResizeDirectionType,
    element: any
  ): void {
    this.isDragDisabled = true;

    element.isDragDisabled = true;
    const mouseX = $event.clientX;
    const mouseY = $event.clientY;
    const dimensionWidth =
      this.resizeCornerRef.nativeElement.parentNode.offsetWidth;
    const dimensionHeight =
      this.resizeCornerRef.nativeElement.parentNode.offsetHeight;

    const duringResize = (e: any) => {
      let dw = dimensionWidth;
      let dh = dimensionHeight;
      let contentHeight = this.content.nativeElement.clientHeight;
      let contentWidth = this.content.nativeElement.clientWidth;
      let contentXStart = this.content.nativeElement.offsetLeft;
      let contentYStart = this.content.nativeElement.offsetTop;
      let contentXEnd = contentWidth + contentXStart;
      let contentYEnd = contentHeight + contentYStart;

      if (
        !(contentXEnd > e.clientX && e.clientX > contentXStart) ||
        !(contentYEnd > e.clientY && e.clientY > contentYStart)
      ) {
        return;
      }

      if (direction === 'x' || direction === 'xy') {
        dw -= mouseX - e.clientX;
      }

      if (direction === 'y' || direction === 'xy') {
        dh -= mouseY - e.clientY;
      }

      if (dw > this.minSize.w) {
        element.style.width = dw;
      }

      if (dh > this.minSize.h) {
        element.style.height = dh;
      }
    };

    this.elementService.selectedElement.next(element);

    const finishResize = (e: any) => {
      this.isDragDisabled = false;
      this._document.removeEventListener('mousemove', duringResize);
      this._document.removeEventListener('mouseup', finishResize);
    };

    this._document.addEventListener('mousemove', duringResize);
    this._document.addEventListener('mouseup', finishResize);
  }

  contentJSON: any;

  createForm(response: file) {
    let parsedJson: any;
    try {
      if (response.content.length)
        parsedJson = JSON.parse(response.content);
      if (parsedJson.length) {

        let contentHeight = this.content.nativeElement.clientHeight;
        let contentWidth = this.content.nativeElement.clientWidth;
        let contentXStart = this.content.nativeElement.offsetLeft;
        let contentYStart = this.content.nativeElement.offsetTop;
        let contentXEnd = contentWidth + contentXStart;
        let contentYEnd = contentHeight + contentYStart;

        parsedJson.forEach((element: any) => {
          if (element.positionRelative && element.styleRelative) {
            element.position = {
              x: Math.round(((element.positionRelative.x * (contentXEnd - contentXStart)) / 100) + contentXStart),
              y: Math.round(((element.positionRelative.y * (contentYEnd - contentYStart)) / 100) + contentYStart)
            }

            element.style.width = Math.round((contentWidth * element.styleRelative.width) / 100);
            element.style.height = Math.round((contentHeight * element.styleRelative.height) / 100);
          }
        });
      }

      this.elementService.elements_.next(parsedJson);
    } catch (exception) {
      this.contentJSON = 'Error';
    }
  }

}
