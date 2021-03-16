import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CastConstraintComponent } from './cast-constraint.component';

describe('CastConstraintComponent', () => {
  let component: CastConstraintComponent;
  let fixture: ComponentFixture<CastConstraintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CastConstraintComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CastConstraintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
