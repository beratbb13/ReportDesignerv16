import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionElementComponent } from './option-element.component';

describe('OptionElementComponent', () => {
  let component: OptionElementComponent;
  let fixture: ComponentFixture<OptionElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OptionElementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OptionElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
