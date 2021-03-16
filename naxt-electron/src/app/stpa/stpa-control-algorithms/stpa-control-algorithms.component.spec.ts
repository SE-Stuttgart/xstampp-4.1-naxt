import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StpaControlAlgorithmsComponent } from './stpa-control-algorithms.component';

describe('StpaControlAlgorithmsComponent', () => {
  let component: StpaControlAlgorithmsComponent;
  let fixture: ComponentFixture<StpaControlAlgorithmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StpaControlAlgorithmsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StpaControlAlgorithmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
