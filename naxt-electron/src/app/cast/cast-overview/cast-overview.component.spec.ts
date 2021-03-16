import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CastOverviewComponent } from './cast-overview.component';

describe('CastOverviewComponent', () => {
  let component: CastOverviewComponent;
  let fixture: ComponentFixture<CastOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CastOverviewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CastOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
