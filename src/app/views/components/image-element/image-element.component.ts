import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-image-element',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './image-element.component.html',
  styleUrl: './image-element.component.css'
})
export class ImageElementComponent {
  @Input() options: any = {};
  @Input() style: any = {};
  @Input() styleRelative: any = null;

}
