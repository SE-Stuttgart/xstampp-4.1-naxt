import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CastSafetyInformationSystemComponent } from './cast-safety-information-system.component';

describe('CastSafetyInformationSystemComponent', () => {
  let component: CastSafetyInformationSystemComponent;
  let fixture: ComponentFixture<CastSafetyInformationSystemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CastSafetyInformationSystemComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CastSafetyInformationSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
