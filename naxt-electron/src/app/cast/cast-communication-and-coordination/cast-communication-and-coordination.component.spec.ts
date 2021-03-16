import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CastCommunicationAndCoordinationComponent } from './cast-communication-and-coordination.component';

describe('CastCommunicationAndCoordinationComponent', () => {
  let component: CastCommunicationAndCoordinationComponent;
  let fixture: ComponentFixture<CastCommunicationAndCoordinationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CastCommunicationAndCoordinationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CastCommunicationAndCoordinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
