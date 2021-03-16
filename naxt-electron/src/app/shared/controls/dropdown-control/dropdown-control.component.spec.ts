import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownControlComponent } from './dropdown-control.component';

describe('DropdownControlComponent', () => {
  let component: DropdownControlComponent;
  let fixture: ComponentFixture<DropdownControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DropdownControlComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
