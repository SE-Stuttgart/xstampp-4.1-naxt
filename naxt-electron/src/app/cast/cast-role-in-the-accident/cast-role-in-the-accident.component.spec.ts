import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CastRoleInTheAccidentComponent } from './cast-role-in-the-accident.component';

describe('CastRoleInTheAccidentComponent', () => {
  let component: CastRoleInTheAccidentComponent;
  let fixture: ComponentFixture<CastRoleInTheAccidentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CastRoleInTheAccidentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CastRoleInTheAccidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
