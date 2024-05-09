import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementToolbarComponent } from './element-toolbar.component';

describe('ElementToolbarComponent', () => {
  let component: ElementToolbarComponent;
  let fixture: ComponentFixture<ElementToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElementToolbarComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ElementToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
