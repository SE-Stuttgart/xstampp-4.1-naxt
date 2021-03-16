import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CastControlStructureComponent } from './cast-control-structure.component';

describe('CastControlStructureComponent', () => {
  let component: CastControlStructureComponent;
  let fixture: ComponentFixture<CastControlStructureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CastControlStructureComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CastControlStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
