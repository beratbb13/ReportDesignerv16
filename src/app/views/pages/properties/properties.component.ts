import { Component } from '@angular/core';
import { ElementService } from '../../../services/element/element.service';
import { AbstractControl, Form, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
  isNum: boolean = false;
  changedSrc: string = '';

  attributeTypes = {
    id: 'text',
    name: 'text',
    type: 'text',
    value: 'text',
    disabled: 'boolean',
    readonly: 'boolean',
    autofocus: 'boolean',
    required: 'boolean',
    minlength: 'number',
    maxlength: 'number',
    pattern: 'text',
    placeholder: 'text',
    size: 'number',
    autocomplete: 'select',
    autocorrect: 'select',
    autocapitalize: 'select',
    spellcheck: 'boolean',
    tabindex: 'number',
    accesskey: 'text',
    title: 'text',
    ariaLabel: 'text',
    ariaDescribedby: 'text',
    ariaExpanded: 'boolean',
    ariaHaspopup: 'select',
    ariaHidden: 'boolean',
    class: 'text',
    contenteditable: 'boolean',
    contextmenu: 'text',
    dir: 'select',
    draggable: 'boolean',
    hidden: 'boolean',
    align: 'select',
    alignItems: 'select',
    justifyContent: 'select',
    min: 'number',
    max: 'number',
    label: 'text',
    src: 'file',
    width: 'number',
    height: 'number',
    fontSize: 'number',
    color: 'color',
    backgroundColor: 'color',
    fontWeight: 'text',
    fontStyle: 'text',
    textDecoration: 'text',
    textAlign: 'text',
    lineHeight: 'text',
    letterSpacing: 'text',
    fontFamily: 'text',
    border: 'text',
    borderRadius: 'number',
    boxShadow: 'text',
    margin: 'number',
    padding: 'number',
    display: 'text',
    position: 'text',
    top: 'text',
    right: 'text',
    bottom: 'text',
    left: 'text',
    zIndex: 'text',
    overflow: 'text',
    borderWidth: 'number',
    borderStyle: 'select',
    borderColor: 'text',
    optionLabel: 'text',
    optionValue: 'text',
    multipleSelection: 'boolean',
    form: 'text',
    formaction: 'text',
    formmethod: 'text',
    formnovalidate: 'boolean',
    formtarget: 'text',
    endPoint: 'text',
    method: 'text'
  };

  controlName: string = '';
  form_Control: string = '';

  constructor(private elementService: ElementService, private fb: FormBuilder) {
    this.propertyForm = this.fb.group({
      properties: this.fb.array([]),
      styles: this.fb.array([]),
      items: this.fb.array([])
    });

    this.elementService.selectedElement.asObservable().subscribe(res => {

      this.selectedElement = res;

      if (res !== null) {
        this.controlName = res.name.toLowerCase();
        if (res.formControlName) {
          this.form_Control = res.formControlName;
        } else {
          this.form_Control = '';
        }
      }


      if (this.properties && this.properties.length)
        this.properties.clear();
      if (res !== null && res.attributes)
        this.createFormObjects(res.attributes);
      if (this.styles && this.styles.length)
        this.styles.clear();
      if (res !== null && res.style)
        this.createStyleObjects(res.style);
      if (this.selectedElement && this.selectedElement.name == 'Selectbox')
        this.items.clear();
      if (this.selectedElement && this.selectedElement.name == 'Selectbox' && this.selectedElement.options.length > 0)
        this.createItemObjects(res.options);
    });
  }

  get properties(): FormArray {
    return this.propertyForm.get('properties') as FormArray;
  }

  get styles(): FormArray {
    return this.propertyForm.get('styles') as FormArray;
  }

  get items(): FormArray {
    return this.propertyForm.get('items') as FormArray;
  }

  createItemObjects(options: any[]) {
    options.forEach((option: any, index: number) => {
      const group = this.fb.group({
        [length + 1]: [option.value]
      });
      this.items.push(group);
    })
  }

  addItem() {
    const length = this.items.controls.length + 1;
    const group = this.fb.group({
      [length]: this.fb.control('')
    })

    this.items.push(group);
  }

  removeItem(formGroup: AbstractControl) {
    this.items.removeAt(this.items.controls.indexOf(formGroup));
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

  createStyleObjects(elementRef: any) {
    let entries = Object.entries(elementRef);

    entries.forEach(([k, v]) => {
      const group = this.fb.group({
        [k]: [v]
      });
      this.styles.push(group);
    })

  }

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

    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        formGroup.get('src')?.setValue(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.selectedElement.name === 'Selectbox') {
      this.items.controls.forEach((control: any) => {
        const value = control.get(Object.keys(control.value)[0]).value;
        if (value) {
          const option = {
            value: value
          };
          this.selectedElement.options.push(option);
        }
      });
    }

    let resultObject: any = {};
    let stylesObject: any = {};
    if (this.selectedElement !== null) {

      if (this.selectedElement.label != 'Combobox' && this.selectedElement.label != 'Listbox') {

        this.properties.controls.forEach((control) => {
          const groupValue = control.value;

          Object.keys(groupValue).forEach((key) => {
            resultObject[key] = groupValue[key];
          });
        });

        this.selectedElement['attributes'] = resultObject;

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

        this.selectedElement['attributes'] = resultObject;

      }

      this.styles.controls.forEach((control) => {
        const groupValue = control.value;
        let key = Object.keys(groupValue)[0];
        let foundedAttribute = Object.entries(this.attributeTypes).find(([k, v]) => k === key);

        Object.keys(groupValue).forEach((key) => {
          let val: any = null;

          if (foundedAttribute && foundedAttribute[1] == 'boolean') {
            val = Boolean(groupValue[key]);
          } else if (foundedAttribute && foundedAttribute[1] == 'text') {
            val = groupValue[key].toString();
          } else if (foundedAttribute && foundedAttribute[1] == 'number') {
            val = parseFloat(groupValue[key]);
          } else {
            val = groupValue[key];
          }

          stylesObject[key] = val;
        });
      });

      this.selectedElement['style'] = stylesObject;

      if (this.controlName === 'checkbox' || this.controlName === 'radio' || this.controlName === 'textbox' || this.controlName === 'selectbox') {
        this.selectedElement['formControlName'] = this.form_Control;
      }

      this.elementService.selectedElement.next(this.selectedElement);
      this.form_Control = '';
      let elements = this.elementService.elements_.getValue();
      let index = elements.findIndex((element) => element.id == this.selectedElement.id);

      elements[index] = this.selectedElement;
      this.elementService.elements_.next(elements);
    }

    this.elementService.selectedElement.next(null);
  }

  getFormControlKey(formGroup: AbstractControl): string {
    return Object.keys(formGroup.value)[0];
  }

  getFormControlValue(formGroup: AbstractControl): FormControl {
    return formGroup.get(Object.keys(formGroup.value)[0]) as FormControl;
  }
}
