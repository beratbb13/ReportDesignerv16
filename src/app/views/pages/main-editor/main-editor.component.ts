import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { ElementService } from '../../../services/element/element.service';
import { CdkDrag, CdkDragEnd } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FolderService } from '../../../services/folder/folder.service';

export type ResizeDirectionType = 'x' | 'y' | 'xy' | 't' | 'l';

@Component({
  selector: 'app-main-editor',
  standalone: true,
  imports: [CdkDrag, FormsModule, CommonModule, ReactiveFormsModule],
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
  contentHeight: number = 0;
  contentWidth: number = 0;
  contentXStart: number = 0;
  contentYStart: number = 0;
  contentXEnd: number = 0;
  contentYEnd: number = 0;

  constructor(
    private elementService: ElementService,
    private folderService: FolderService,
    @Inject(DOCUMENT) private _document: Document) {
  }

  ngAfterViewInit() {
    this.contentHeight = this.content.nativeElement.clientHeight;
    this.contentWidth = this.content.nativeElement.clientWidth;
    this.contentXStart = this.content.nativeElement.offsetLeft;
    this.contentYStart = this.content.nativeElement.offsetTop;
    this.contentXEnd = this.contentWidth + this.contentXStart;
    this.contentYEnd = this.contentHeight + this.contentYStart;

    this.folderService.content.next({
      x: this.content.nativeElement.offsetLeft, y: this.content.nativeElement.offsetTop,
      width: this.content.nativeElement.clientWidth, height: this.content.nativeElement.clientHeight
    });
  }

  ngOnInit() {
    console.log('asdasd');
    this.folderService.selectedFile.asObservable().subscribe(res => {
      if (res) {
        if (this.fileId !== res.fileId) {
          this.fileId = res.fileId;
          if (res?.content != null) {
            this.elementService.changedElements.next(JSON.parse(res.content));
          } else {
            //this.mainEditorComponent.elements = [];
            //this.elementService.elements.next([]);
            this.elementService.changedElements.next([]);
          }
        }
      }
    });

    this.folderService.save.asObservable().subscribe(isSaved => {
      if (isSaved) {
        this.getBounds();

        this.elementService.selectedElement.next(null);
        this.folderService.save.next(false);
        this.elementService.changedElements.next(this.elements);
      }
    });

    /*this.folderService.tempSelectedFile.asObservable().subscribe(tempSelectedFile => {
      if (tempSelectedFile !== null) {
        this.fileId = tempSelectedFile.fileId;
        if (tempSelectedFile.content !== null) {
          if (JSON.parse(tempSelectedFile.content).length)
            this.elementService.changedElements.next(JSON.parse(tempSelectedFile.content));
          //this.createForm(JSON.parse(tempSelectedFile.content));
        } else {
          this.elementService.changedElements.next([]);
        }
        debugger
        this.folderService.selectedFile.next(tempSelectedFile);
      }
    });*/

    let isPreviewMode = this.elementService.previewMode.getValue();
    if (isPreviewMode) {
      this.getBounds();
      this.elementService.changedElements.next(this.elements);
      console.log(this.elementService.changedElements.getValue());
    }

    this.elementService.changedElements.asObservable().subscribe(changedElements => {
      if (changedElements) {
        this.createForm(changedElements);
      }
    });

    /*this.elementService.elements.asObservable().subscribe(res => {
      //if (res.length)
      this.createForm(res);
    });*/

  }

  getBounds() {
    this.elements.forEach(element => {
      let bounds = document.getElementById(element.id)?.getBoundingClientRect();
      if (bounds) {
        element.position = {
          x: bounds.x,
          y: bounds.y
        }
      }
    });
  }

  removeElement(event: MouseEvent, element: any) {
    event.preventDefault();
    let filtered = this.elements.filter(el => el.id !== element.id);
    this.getBounds();
    this.elementService.changedElements.next(filtered);

    /*let selectedFile = this.folderService.selectedFile.getValue();
    let elements = this.elementService.elements.getValue();
    if (selectedFile) {
      selectedFile.content = JSON.stringify(elements);
    }
    this.elements = elements;*/

    this.elementService.selectedElement.next(null);
  }

  onFocus(event: MouseEvent, element: any) {
    event.preventDefault();
    this.elementService.selectedElement.next(element);
    this.selectedElementId = element.id;
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

      if (
        !(this.contentXEnd > e.clientX && e.clientX > this.contentXStart) ||
        !(this.contentYEnd > e.clientY && e.clientY > this.contentYStart)
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

  contentJSON: string = 'Choose a file';

  createForm(parsedJson: any[]) {
    this.elementService.elements.next(parsedJson);
    this.elements = parsedJson;
  }
}