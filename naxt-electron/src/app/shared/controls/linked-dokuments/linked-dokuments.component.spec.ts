import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedDokumentsComponent } from './linked-dokuments.component';

describe('LinkedDokumentsComponent', () => {
  let component: LinkedDokumentsComponent;
  let fixture: ComponentFixture<LinkedDokumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LinkedDokumentsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkedDokumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
