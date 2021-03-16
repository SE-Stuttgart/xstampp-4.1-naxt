import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CastResponsibilitiesComponent } from './cast-responsibilities.component';

describe('CastResponsibilitiesComponent', () => {
  let component: CastResponsibilitiesComponent;
  let fixture: ComponentFixture<CastResponsibilitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CastResponsibilitiesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CastResponsibilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
