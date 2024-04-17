import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ElementService } from '../../../services/element/element.service';

@Component({
  selector: 'app-textarea-element',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './textarea-element.component.html',
  styleUrl: './textarea-element.component.css'
})
export class TextareaElementComponent {

  @Input() options: any = {};
  @Input() style: any = {};
  @Input() styleRelative: any = null;

  text: string = '';

  constructor(private elementService: ElementService) { }

  ngOnChanges() {
    this.text = this.options.text;
  }

  onChange() {
    this.options.text = this.text;
    this.elementService.setSelectedElement(this.options);
  }

}
