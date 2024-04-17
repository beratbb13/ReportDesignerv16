import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkElementComponent } from './link-element.component';

describe('LinkElementComponent', () => {
  let component: LinkElementComponent;
  let fixture: ComponentFixture<LinkElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LinkElementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LinkElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
