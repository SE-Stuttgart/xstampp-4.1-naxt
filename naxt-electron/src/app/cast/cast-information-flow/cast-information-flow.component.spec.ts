import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CastInformationFlowComponent } from './cast-information-flow.component';

describe('CastInformationFlowComponent', () => {
  let component: CastInformationFlowComponent;
  let fixture: ComponentFixture<CastInformationFlowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CastInformationFlowComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CastInformationFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
