import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StpaLossScenariosComponent } from './stpa-loss-scenarios.component';

describe('StpaLossScenariosComponent', () => {
  let component: StpaLossScenariosComponent;
  let fixture: ComponentFixture<StpaLossScenariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StpaLossScenariosComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StpaLossScenariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
