import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StpaUcaRefinementComponent } from './stpa-uca-refinement.component';

describe('StpaUcaRefinementComponent', () => {
  let component: StpaUcaRefinementComponent;
  let fixture: ComponentFixture<StpaUcaRefinementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StpaUcaRefinementComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StpaUcaRefinementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
