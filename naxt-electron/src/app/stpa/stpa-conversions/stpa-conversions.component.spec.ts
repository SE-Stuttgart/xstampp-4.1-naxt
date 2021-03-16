import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StpaConversionsComponent } from './stpa-conversions.component';

describe('StpaConversionsComponent', () => {
  let component: StpaConversionsComponent;
  let fixture: ComponentFixture<StpaConversionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StpaConversionsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StpaConversionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
