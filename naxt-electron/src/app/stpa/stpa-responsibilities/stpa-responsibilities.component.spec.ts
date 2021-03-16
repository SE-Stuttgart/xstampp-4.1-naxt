import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StpaResponsibilitiesComponent } from './stpa-responsibilities.component';

describe('StpaResponsibilitiesComponent', () => {
  let component: StpaResponsibilitiesComponent;
  let fixture: ComponentFixture<StpaResponsibilitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StpaResponsibilitiesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StpaResponsibilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
