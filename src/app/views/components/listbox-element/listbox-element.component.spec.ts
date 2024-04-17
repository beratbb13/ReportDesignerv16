import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListboxElementComponent } from './listbox-element.component';

describe('ListboxElementComponent', () => {
  let component: ListboxElementComponent;
  let fixture: ComponentFixture<ListboxElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListboxElementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListboxElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
