import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommondationsButtonGroupComponent } from './recommondations-button-group.component';

describe('RecommondationsButtonGroupComponent', () => {
  let component: RecommondationsButtonGroupComponent;
  let fixture: ComponentFixture<RecommondationsButtonGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RecommondationsButtonGroupComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommondationsButtonGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
