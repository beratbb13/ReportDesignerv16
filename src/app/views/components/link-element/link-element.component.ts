import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-link-element',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './link-element.component.html',
  styleUrl: './link-element.component.css'
})
export class LinkElementComponent {
  @Input() options: any = {};
  @Input() style: any = {};
  @Input() styleRelative: any = null;

}
