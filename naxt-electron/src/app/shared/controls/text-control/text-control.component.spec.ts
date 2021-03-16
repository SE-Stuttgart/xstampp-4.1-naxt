import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextControlComponent } from './text-control.component';

describe('TextControlComponent', () => {
  let component: TextControlComponent;
  let fixture: ComponentFixture<TextControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TextControlComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
