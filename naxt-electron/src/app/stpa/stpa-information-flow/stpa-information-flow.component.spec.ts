import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StpaInformationFlowComponent } from './stpa-information-flow.component';

describe('StpaInformationFlowComponent', () => {
  let component: StpaInformationFlowComponent;
  let fixture: ComponentFixture<StpaInformationFlowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StpaInformationFlowComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StpaInformationFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
