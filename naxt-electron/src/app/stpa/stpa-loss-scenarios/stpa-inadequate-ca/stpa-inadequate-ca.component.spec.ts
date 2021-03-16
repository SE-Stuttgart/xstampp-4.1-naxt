import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StpaInadequateCaComponent } from './stpa-inadequate-ca.component';

describe('StpaInadequateCaComponent', () => {
  let component: StpaInadequateCaComponent;
  let fixture: ComponentFixture<StpaInadequateCaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StpaInadequateCaComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StpaInadequateCaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
