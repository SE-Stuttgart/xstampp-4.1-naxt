import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StpaSystemLevelSafetyConstraintsComponent } from './stpa-system-level-safety-constraints.component';

describe('StpaSystemLevelSafetyConstraintsComponent', () => {
  let component: StpaSystemLevelSafetyConstraintsComponent;
  let fixture: ComponentFixture<StpaSystemLevelSafetyConstraintsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StpaSystemLevelSafetyConstraintsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StpaSystemLevelSafetyConstraintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
