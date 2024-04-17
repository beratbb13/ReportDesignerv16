import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComboboxElementComponent } from './combobox-element.component';

describe('ComboboxElementComponent', () => {
  let component: ComboboxElementComponent;
  let fixture: ComponentFixture<ComboboxElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComboboxElementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComboboxElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
