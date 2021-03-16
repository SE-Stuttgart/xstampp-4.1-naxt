import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StpaUnsafeCiComponent } from './stpa-unsafe-ci.component';

describe('StpaUnsafeCiComponent', () => {
  let component: StpaUnsafeCiComponent;
  let fixture: ComponentFixture<StpaUnsafeCiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StpaUnsafeCiComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StpaUnsafeCiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
