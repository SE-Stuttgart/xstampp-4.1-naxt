import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogLinkedDocumentsComponent } from './dialog-linked-documents.component';

describe('DialogLinkedDocumentsComponent', () => {
  let component: DialogLinkedDocumentsComponent;
  let fixture: ComponentFixture<DialogLinkedDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DialogLinkedDocumentsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogLinkedDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
