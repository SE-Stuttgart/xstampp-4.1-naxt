import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChipCreateComponent } from './chip-create.component';

describe('ChipCreateComponent', () => {
  let component: ChipCreateComponent;
  let fixture: ComponentFixture<ChipCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChipCreateComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChipCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
