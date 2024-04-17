import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxElementComponent } from './checkbox-element.component';

describe('CheckboxElementComponent', () => {
  let component: CheckboxElementComponent;
  let fixture: ComponentFixture<CheckboxElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxElementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CheckboxElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
