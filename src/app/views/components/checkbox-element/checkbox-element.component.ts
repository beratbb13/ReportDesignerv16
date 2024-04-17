import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkbox-element',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './checkbox-element.component.html',
  styleUrl: './checkbox-element.component.css'
})
export class CheckboxElementComponent {
  @Input() options: any = {};
  @Input() style: any = {};
  @Input() styleRelative: any = null;
}
