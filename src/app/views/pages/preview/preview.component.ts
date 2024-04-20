import { CommonModule } from '@angular/common';
import { Component, ElementRef, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ElementService } from '../../../services/element/element.service';
import { FolderService } from '../../../services/folder/folder.service';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.css',
  schemas: [NO_ERRORS_SCHEMA]
})
export class PreviewComponent {

  constructor(private elementService: ElementService, private fileService: FolderService, private fb: FormBuilder) { }

  @ViewChild('content', { static: true }) content!: ElementRef;

  elements: any[] = [];
  myForm!: FormGroup;
  controlName: string = '';


  ngOnInit() {

    this.myForm = this.fb.group({
      formArray: this.fb.array([])
    });

    this.fileService.selectedFile.asObservable().subscribe(res => {
      if (res.content.length) {
        let elements = JSON.parse(res.content);
        this.elements = elements;

        this.createFormElements(elements);
      }
    })
  }

  get formArray() {
    return this.myForm.get('formArray') as FormArray;
  }

  createFormElements(elements: any[]) {
    elements.forEach((element: any) => {
      this.controlName = element.name.toLowerCase();

      let group: any;

      if (this.controlName === 'checkbox' || this.controlName === 'radio' || this.controlName === 'textbox' || this.controlName === 'selectbox') {
        group = this.fb.group({
          [element.formControlName]: [element.value]
        });
      } else {
        group = this.fb.group({
          [element.id]: [element.value]
        });
      }

      this.formArray.push(group);
    })

  }

  getFormGroup(id: string) {
    return this.formArray.controls.find((control: any) => Object.keys(control.value)[0] == id);
  }

  formSubmit() {

    const formElements = document.forms[0].elements;

    for (let i = 0; i < formElements.length; i++) {
      const element = formElements[i];
      if (element instanceof HTMLInputElement) {
        if (element.type === 'text' || element.type === 'number' || element.type === 'date') {
          const classList = element.classList;

          classList.forEach(className => {
            if (className.startsWith('ng-')) {
              classList.remove(className);
            }
          });

          console.log(classList + ": " + (element as HTMLInputElement).value);
        } else if (element.type === 'checkbox' || element.type === 'radio') {
          const classList = element.classList;

          classList.forEach(className => {
            if (className.startsWith('ng-')) {
              classList.remove(className);
            }
          });

          console.log(classList + ": " + (element as HTMLInputElement).checked);
        }
      } else if (element instanceof HTMLSelectElement) {
        const classList = element.classList;

        classList.forEach(className => {
          if (className.startsWith('ng-')) {
            classList.remove(className);
          }
        });
        console.log(classList + ": " + (element as HTMLSelectElement).value);
      }
      // Diğer form elemanları
    }

  }


}
