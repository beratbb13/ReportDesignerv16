import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubFileComponent } from './sub-file.component';

describe('SubFileComponent', () => {
  let component: SubFileComponent;
  let fixture: ComponentFixture<SubFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubFileComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SubFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
