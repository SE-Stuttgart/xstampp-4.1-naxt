import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipControllerComponent } from './chip-controller.component';

describe('ChipControllerComponent', () => {
  let component: ChipControllerComponent;
  let fixture: ComponentFixture<ChipControllerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChipControllerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChipControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
