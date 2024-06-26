import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageElementComponent } from './image-element.component';

describe('ImageElementComponent', () => {
  let component: ImageElementComponent;
  let fixture: ComponentFixture<ImageElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageElementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImageElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
