import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StpaUcaComponent } from './stpa-uca.component';

describe('StpaUcaComponent', () => {
  let component: StpaUcaComponent;
  let fixture: ComponentFixture<StpaUcaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StpaUcaComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StpaUcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
