import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CastSubRecommondationsComponent } from './cast-sub-recommondations.component';

describe('CastSubRecommondationsComponent', () => {
  let component: CastSubRecommondationsComponent;
  let fixture: ComponentFixture<CastSubRecommondationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CastSubRecommondationsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CastSubRecommondationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
