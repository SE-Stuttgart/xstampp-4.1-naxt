import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiLineTextComponent } from './multi-line-text.component';

describe('MultiLineTextComponent', () => {
  let component: MultiLineTextComponent;
  let fixture: ComponentFixture<MultiLineTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MultiLineTextComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiLineTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
