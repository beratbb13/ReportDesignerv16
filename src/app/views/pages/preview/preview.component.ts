import { CommonModule } from '@angular/common';
import { Component, ElementRef, NO_ERRORS_SCHEMA, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpService } from '../../../services/http/http.service';
import { HttpClientModule } from '@angular/common/http';
import { ElementService } from '../../../services/element/element.service';

@Component({
  selector: 'app-preview',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './preview.component.html',
  styleUrl: './preview.component.css',
  schemas: [NO_ERRORS_SCHEMA]
})
export class PreviewComponent {
  constructor(private elementService: ElementService, private fb: FormBuilder, private http: HttpService) {
  }

  @ViewChild('content', { static: true }) content!: ElementRef;
  elements: any[] = [];
  myForm!: FormGroup;
  controlName: string = '';
  endpoint_url: string = '';
  method: string = '';

  ngOnInit() {
    this.myForm = this.fb.group({
      formArray: this.fb.array([])
    });

    this.elementService.changedElements.asObservable().subscribe(res => {
      if (this.elements !== res) {
        console.log(res);
        this.elements = res;
        this.createFormElements(res);
      }
    });
  }

  get formArray() {
    return this.myForm.get('formArray') as FormArray;
  }

  createFormElements(elements: any[]) {
    elements.forEach((element: any) => {
      this.controlName = element.name.toLowerCase();

      if (this.controlName === 'button') {
        this.endpoint_url = element.attributes.endPoint;
        this.method = element.attributes.method.toLowerCase();
      }

      let group: any;

      if (this.controlName === 'checkbox' || this.controlName === 'radio' || this.controlName === 'textbox'
        || this.controlName === 'selectbox') {
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
    const formData: any = {};

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

          let stringClassList = classList[0];

          formData[stringClassList] = (element as HTMLInputElement).value;

        } else if (element.type === 'checkbox' || element.type === 'radio') {
          const classList = element.classList;

          classList.forEach(className => {
            if (className.startsWith('ng-')) {
              classList.remove(className);
            }
          });

          let stringClassList = classList[0];

          formData[stringClassList] = (element as HTMLInputElement).checked;

        }
      } else if (element instanceof HTMLSelectElement) {
        const classList = element.classList;

        classList.forEach(className => {
          if (className.startsWith('ng-')) {
            classList.remove(className);
          }
        });
        let stringClassList = classList[0];

        formData[stringClassList] = (element as HTMLSelectElement).value;

      }
    }
    if (this.method === 'post') {
      this.http.postApi(this.endpoint_url, formData).subscribe(res => console.log(res));
    } else {
      this.http.getApi(this.endpoint_url, formData).subscribe(res => console.log(res));
    }
  }
}