import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StpaSystemLevelHazardsComponent } from './stpa-system-level-hazards.component';

describe('StpaSystemLevelHazardsComponent', () => {
  let component: StpaSystemLevelHazardsComponent;
  let fixture: ComponentFixture<StpaSystemLevelHazardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StpaSystemLevelHazardsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StpaSystemLevelHazardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
