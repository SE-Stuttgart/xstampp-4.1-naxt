import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CastAccidentDescriptionComponent } from './cast-accident-description.component';

describe('CastAccidentDescriptionComponent', () => {
  let component: CastAccidentDescriptionComponent;
  let fixture: ComponentFixture<CastAccidentDescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CastAccidentDescriptionComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CastAccidentDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
