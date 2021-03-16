import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StpaControllerConstraintsComponent } from './stpa-controller-constraints.component';

describe('StpaControllerConstraintsComponent', () => {
  let component: StpaControllerConstraintsComponent;
  let fixture: ComponentFixture<StpaControllerConstraintsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StpaControllerConstraintsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StpaControllerConstraintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
