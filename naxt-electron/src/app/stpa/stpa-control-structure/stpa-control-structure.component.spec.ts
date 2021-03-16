import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StpaControlStructureComponent } from './stpa-control-structure.component';

describe('StpaControlStructureComponent', () => {
  let component: StpaControlStructureComponent;
  let fixture: ComponentFixture<StpaControlStructureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StpaControlStructureComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StpaControlStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
