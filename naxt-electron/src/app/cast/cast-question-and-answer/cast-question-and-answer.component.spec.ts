import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CastQuestionAndAnswerComponent } from './cast-question-and-answer.component';

describe('CastQuestionAndAnswerComponent', () => {
  let component: CastQuestionAndAnswerComponent;
  let fixture: ComponentFixture<CastQuestionAndAnswerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CastQuestionAndAnswerComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CastQuestionAndAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
