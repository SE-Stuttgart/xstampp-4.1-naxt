import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CastInternalAndExternalEconomicsComponent } from './cast-internal-and-external-economics.component';

describe('CastInternalAndExternalEconomicsComponent', () => {
  let component: CastInternalAndExternalEconomicsComponent;
  let fixture: ComponentFixture<CastInternalAndExternalEconomicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CastInternalAndExternalEconomicsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CastInternalAndExternalEconomicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
