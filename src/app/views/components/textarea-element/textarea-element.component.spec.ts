import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextareaElementComponent } from './textarea-element.component';

describe('TextareaElementComponent', () => {
  let component: TextareaElementComponent;
  let fixture: ComponentFixture<TextareaElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextareaElementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TextareaElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
