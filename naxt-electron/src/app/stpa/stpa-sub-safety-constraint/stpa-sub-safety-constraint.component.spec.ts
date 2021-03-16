import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StpaSubSafetyConstraintComponent } from './stpa-sub-safety-constraint.component';

describe('StpaSubSafetyConstraintComponent', () => {
  let component: StpaSubSafetyConstraintComponent;
  let fixture: ComponentFixture<StpaSubSafetyConstraintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StpaSubSafetyConstraintComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StpaSubSafetyConstraintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
