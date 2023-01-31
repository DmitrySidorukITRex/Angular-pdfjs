import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTagModalComponent } from './add-tag-modal.component';

describe('AddTagModalComponent', () => {
  let component: AddTagModalComponent;
  let fixture: ComponentFixture<AddTagModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTagModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTagModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
