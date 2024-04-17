import { Component } from '@angular/core';
import { ElementService } from '../../../services/element/element.service';
import { AbstractControl, Form, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { isArrayBuffer } from 'util/types';

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './properties.component.html',
  styleUrl: './properties.component.css'
})
export class PropertiesComponent {

  propertyForm!: FormGroup;
  selectedElement: any = null;
  constructor(private elementService: ElementService, private fb: FormBuilder) {

    this.propertyForm = this.fb.group({
      properties: this.fb.array([])
    });

    this.elementService.selectedElement.asObservable().subscribe(res => {
      if (res !== null) {
        this.selectedElement = res;
        if (this.properties && this.properties.length)
          this.properties.clear();
        if (res.element)
          this.createFormObjects(res.element); //res.element denedim sonradan
      }
    });
  }

  get properties(): FormArray {
    return this.propertyForm.get('properties') as FormArray;
  }

  createFormObjects(elementRef: any) {
    let entries = Object.entries(elementRef);

    if (!(this.selectedElement.label == 'Combobox' || this.selectedElement.label == "Listbox"))
      entries.forEach(([k, v]) => {
        const group = this.fb.group({
          [k]: [v]
        });
        this.properties.push(group);
      })
    else
      entries.forEach(([k, v]) => {
        if (v instanceof Object) {
          this.createFormObjects(v);
        } else {
          const group = this.fb.group({
            [k]: [v]
          });
          this.properties.push(group);
        }
      });
  }

  removeElement() {
    this.elementService.removeElement();
    this.selectedElement = null;
    console.log(this.selectedElement);
  }

  /*createFormObjects(elementRef: any, formArray: FormArray = this.fb.array([])) {
    const array = Object.entries(elementRef);

    array.forEach(([k, v]) => {
      if (v instanceof Object) {
        // Eğer eleman bir obje ise, bu fonksiyonu tekrar çağır
        this.createFormObjects(v, formArray);
      } else {
        // Eğer eleman bir obje değilse, normal bir form group oluşturup form array'e ekleyelim
        const group = this.fb.group({
          [k]: [v]
        });
        formArray.push(group);
      }
    });

    // Dışarıdan gelen form array'e elemanları eklemiş oluyoruz
    return formArray;
  }*/


  getMaxLength(): number | string | null {
    const maxLengthObject = this.properties.value.find((v: any) => v['maxLength']);

    if (maxLengthObject) {
      const maxLengthValue = Object.values(maxLengthObject)[0];
      return maxLengthValue as number | string;
    } else {
      return null;
    }
  }

  getMinLength(): number | string | null {
    const minLengthObject = this.properties.value.find((v: any) => v['minLength']);

    if (minLengthObject) {
      const minLengthValue = Object.values(minLengthObject)[0];
      return minLengthValue as number | string;
    } else {
      return null;
    }
  }

  getMax(): number | string | null {
    const maxObject = this.properties.value.find((v: any) => v['max']);

    if (maxObject) {
      const maxValue = Object.values(maxObject)[0];
      return maxValue as number | string;
    } else {
      return null;
    }
  }

  getMin(): number | string | null {
    const minObject = this.properties.value.find((v: any) => v['min']);

    if (minObject) {
      const minValue = Object.values(minObject)[0];
      return minValue as number | string;
    } else {
      return null;
    }
  }

  isNum: boolean = false;
  changedSrc: string = '';

  attributeTypes = {
    text: 'text',
    value: 'text',
    align: 'select',
    alignItems: 'select',
    justifyContent: 'select',
    min: 'number',
    label: 'text',
    src: 'file',
    title: 'text',
    max: 'number',
    class: 'text',
    minLength: 'number',
    maxLength: 'number',
    placeholder: 'text',
    readonly: 'boolean',
    required: 'boolean',
    disabled: 'boolean',
    width: 'number',
    height: 'number',
    fontColor: 'color',
    fontSize: 'number',
    backgroundColor: 'color',
    borderWidth: 'number',
    borderStyle: 'select',
    borderColor: 'color',
    optionLabel: 'text',
    optionValue: 'text',
    multipleSelection: 'boolean',
  }

  getControlTypeByAttributeName(attribute: string): string {
    try {
      let index = Object.keys(this.attributeTypes).findIndex(e => e == attribute);
      return Object.entries(this.attributeTypes)[index][1] || 'yok';
    } catch (error) {
      return 'yok';
    }

  }

  onFileSelected(event: any, formGroup: FormGroup | any): void {
    const file: File = event.target.files[0];

    /*if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.changedSrc = e.target.result;
  
      };
      reader.readAsDataURL(file);
    }*/

    this.properties.controls.forEach((control: any) => {
      formGroup.get('src')?.setValue('deneme');
    })
  }

  onchange(newValues: any): any {
    let result: any = {}; // Boş bir nesne oluştur

    if (newValues.properties) {
      result = newValues.properties.reduce((acc: any, obj: any) => {
        const key = Object.keys(obj)[0]; // Her objenin içindeki tek öğeyi al
        acc[key] = obj[key];
        return acc;
      }, {});

      this.selectedElement['element'] = result;
      //this.elementService.selectedElement.next(this.selectedElement);
    }

    return result; // result nesnesini döndür
  }


  onSubmit() {
    let resultObject: any = {};
    if (this.selectedElement !== null) {

      if (this.selectedElement.label != 'Combobox' && this.selectedElement.label != 'Listbox') {

        this.properties.controls.forEach((control) => {
          const groupValue = control.value;

          Object.keys(groupValue).forEach((key) => {
            resultObject[key] = groupValue[key];
          });
        });

        this.selectedElement['element'] = resultObject;
      } else {
        let resultObject: any = {};

        let values: any[] = [];
        let texts: any[] = [];

        this.properties.controls.forEach((control) => {
          let result = this.getFormControlKey(control);

          if (result == 'value') {
            values.push(control.value.value);
          } else if (result == 'text') {
            texts.push(control.value.text);
          } else {
            let entries = Object.entries(control.value);

            entries.map(([k, v]) => {
              resultObject[k] = v;
            });

          }
        });

        let finalArray: any[] = [];

        for (let i = 0; i < values.length; i++) {
          if (values[i] && texts[i]) {
            finalArray.push({ value: values[i], text: texts[i] });
          }
        }

        resultObject['options'] = finalArray;

        this.selectedElement['element'] = resultObject;
      }
      console.log(resultObject);
    }
  }

  getFormControlKey(formGroup: AbstractControl): string {
    return Object.keys(formGroup.value)[0];
  }

  getFormControlValue(formGroup: AbstractControl): FormControl {
    return formGroup.get(Object.keys(formGroup.value)[0]) as FormControl;
  }
}
