import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-option-element',
  standalone: true,
  imports: [],
  templateUrl: './option-element.component.html',
  styleUrl: './option-element.component.css'
})
export class OptionElementComponent {
  @Input() options: any = {};
}
