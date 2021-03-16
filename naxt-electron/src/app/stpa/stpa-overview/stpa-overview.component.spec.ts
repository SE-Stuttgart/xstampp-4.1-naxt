import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StpaOverviewComponent } from './stpa-overview.component';

describe('OverviewComponent', () => {
  let component: StpaOverviewComponent;
  let fixture: ComponentFixture<StpaOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StpaOverviewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StpaOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
