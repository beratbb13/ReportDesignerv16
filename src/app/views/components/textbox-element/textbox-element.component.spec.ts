import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextboxElementComponent } from './textbox-element.component';

describe('TextboxElementComponent', () => {
  let component: TextboxElementComponent;
  let fixture: ComponentFixture<TextboxElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextboxElementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TextboxElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
