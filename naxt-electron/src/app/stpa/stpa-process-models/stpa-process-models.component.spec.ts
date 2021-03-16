import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StpaProcessModelsComponent } from './stpa-process-models.component';

describe('StpaProcessModelsComponent', () => {
  let component: StpaProcessModelsComponent;
  let fixture: ComponentFixture<StpaProcessModelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StpaProcessModelsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StpaProcessModelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
