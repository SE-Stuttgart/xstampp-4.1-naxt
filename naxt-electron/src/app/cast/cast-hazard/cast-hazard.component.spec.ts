import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CastHazardComponent } from './cast-hazard.component';

describe('CastHazardComponent', () => {
  let component: CastHazardComponent;
  let fixture: ComponentFixture<CastHazardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CastHazardComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CastHazardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
