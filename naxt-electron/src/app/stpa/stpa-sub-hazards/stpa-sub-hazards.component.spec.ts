import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StpaSubHazardsComponent } from './stpa-sub-hazards.component';

describe('StpaSubHazardsComponent', () => {
  let component: StpaSubHazardsComponent;
  let fixture: ComponentFixture<StpaSubHazardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StpaSubHazardsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StpaSubHazardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
