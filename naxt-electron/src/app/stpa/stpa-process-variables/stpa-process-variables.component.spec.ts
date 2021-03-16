import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StpaProcessVariablesComponent } from './stpa-process-variables.component';

describe('StpaProcessVariablesComponent', () => {
  let component: StpaProcessVariablesComponent;
  let fixture: ComponentFixture<StpaProcessVariablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StpaProcessVariablesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StpaProcessVariablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
