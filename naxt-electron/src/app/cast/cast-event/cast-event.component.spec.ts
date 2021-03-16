import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CastEventComponent } from './cast-event.component';

describe('CastEventComponent', () => {
  let component: CastEventComponent;
  let fixture: ComponentFixture<CastEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CastEventComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CastEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
