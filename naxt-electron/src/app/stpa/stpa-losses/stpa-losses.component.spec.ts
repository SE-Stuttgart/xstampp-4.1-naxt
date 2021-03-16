import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StpaLossesComponent } from './stpa-losses.component';

describe('StpaLossesComponent', () => {
  let component: StpaLossesComponent;
  let fixture: ComponentFixture<StpaLossesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StpaLossesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StpaLossesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
