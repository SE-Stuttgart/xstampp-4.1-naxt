import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StpaFailuresComponent } from './stpa-failures.component';

describe('StpaFailuresComponent', () => {
  let component: StpaFailuresComponent;
  let fixture: ComponentFixture<StpaFailuresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StpaFailuresComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StpaFailuresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
