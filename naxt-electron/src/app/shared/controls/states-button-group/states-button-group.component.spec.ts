import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatesButtonGroupComponent } from './states-button-group.component';

describe('StatesButtonGroupComponent', () => {
  let component: StatesButtonGroupComponent;
  let fixture: ComponentFixture<StatesButtonGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StatesButtonGroupComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatesButtonGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
