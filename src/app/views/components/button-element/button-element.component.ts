import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-button-element',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './button-element.component.html',
  styleUrl: './button-element.component.css'
})
export class ButtonElementComponent {
  @Input() options: any = {};
  @Input() style: any = {};
  @Input() styleRelative: any = null;
}
