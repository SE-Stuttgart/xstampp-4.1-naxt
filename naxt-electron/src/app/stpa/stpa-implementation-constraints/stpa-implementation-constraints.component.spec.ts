import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StpaImplementationConstraintsComponent } from './stpa-implementation-constraints.component';

describe('StpaImplementationConstraintsComponent', () => {
  let component: StpaImplementationConstraintsComponent;
  let fixture: ComponentFixture<StpaImplementationConstraintsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StpaImplementationConstraintsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StpaImplementationConstraintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
