import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StpaInadequatePmComponent } from './stpa-inadequate-pm.component';

describe('StpaInadequatePmComponent', () => {
  let component: StpaInadequatePmComponent;
  let fixture: ComponentFixture<StpaInadequatePmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StpaInadequatePmComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StpaInadequatePmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
