import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CastSafetyCultureComponent } from './cast-safety-culture.component';

describe('CastSafetyCultureComponent', () => {
  let component: CastSafetyCultureComponent;
  let fixture: ComponentFixture<CastSafetyCultureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CastSafetyCultureComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CastSafetyCultureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
