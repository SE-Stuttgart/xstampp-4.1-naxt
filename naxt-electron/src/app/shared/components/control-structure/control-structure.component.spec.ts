import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlStructureComponent } from './control-structure.component';

describe('ControlStructureComponent', () => {
  let component: ControlStructureComponent;
  let fixture: ComponentFixture<ControlStructureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ControlStructureComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
