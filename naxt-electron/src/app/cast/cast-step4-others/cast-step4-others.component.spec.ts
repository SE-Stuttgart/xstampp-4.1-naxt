import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CastStep4OthersComponent } from './cast-step4-others.component';

describe('CastStep4OthersComponent', () => {
  let component: CastStep4OthersComponent;
  let fixture: ComponentFixture<CastStep4OthersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CastStep4OthersComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CastStep4OthersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
