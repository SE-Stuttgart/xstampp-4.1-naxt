import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CastChangesAndDynamicsComponent } from './cast-changes-and-dynamics.component';

describe('CastChangesAndDynamicsComponent', () => {
  let component: CastChangesAndDynamicsComponent;
  let fixture: ComponentFixture<CastChangesAndDynamicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CastChangesAndDynamicsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CastChangesAndDynamicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
