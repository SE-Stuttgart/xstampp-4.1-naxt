import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StpaSystemComponentsComponent } from './stpa-system-components.component';

describe('StpaSystemComponentsComponent', () => {
  let component: StpaSystemComponentsComponent;
  let fixture: ComponentFixture<StpaSystemComponentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StpaSystemComponentsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StpaSystemComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
