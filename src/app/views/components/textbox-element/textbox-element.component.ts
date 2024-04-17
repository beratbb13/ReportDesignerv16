import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FolderService } from '../../../services/folder/folder.service';
import { ElementService } from '../../../services/element/element.service';

@Component({
  selector: 'app-textbox-element',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './textbox-element.component.html',
  styleUrl: './textbox-element.component.css'
})
export class TextboxElementComponent {
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
