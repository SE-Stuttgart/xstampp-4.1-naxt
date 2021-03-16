import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { AppNavigationService, KeyValuePair, MessageService } from '@core/index';
import { TranslateService } from '@ngx-translate/core';
import { ColumnDefinition, ExpandTimings, Subscriptions, TableComponent } from '@shared/index';
import { tap } from 'rxjs/operators';
import { QuestionAndAnswer, questionAndAnswerController, QuestionAndAnswerTableModel } from '@cast/index';
import { pausable, PausableObservable } from '@shared/utils/PausableObservable';

@Component({
  selector: 'naxt-cast-question-and-answer',
  templateUrl: './cast-question-and-answer.component.html',
  styleUrls: ['./cast-question-and-answer.component.scss'],
})
export class CastQuestionAndAnswerComponent implements AfterViewInit, OnDestroy {
  private readonly subscriptions: Subscriptions = new Subscriptions();
  private readonly dataSubscriptions: Subscriptions = new Subscriptions();

  @ViewChild(TableComponent) table: TableComponent<QuestionAndAnswerTableModel>;
  //@Input() questionAndAnswerId: number = 1;

  questionAndAnswerData: QuestionAndAnswerTableModel[] = [];
  private shouldCreateNew: boolean = false;
  private shouldFocus: boolean = false;
  private firstLoad: boolean = false;

  ngAfterViewInit(): void {
    this.subscriptions.plusOne = this.table.rowExpanded
      .pipe(
        tap(questionAndAnswer => {
          this.navigationService.setNewKeyValue(new KeyValuePair(questionAndAnswer.tableId));
        })
      )
      .subscribe();

    this.subscriptions.plusOne = this.table.rowCollapsed
      .pipe(
        tap(questionAndAnswer => {
          questionAndAnswerController
            .updateQuestionAnswer(questionAndAnswer)
            .catch((err: Error) => this.msg.info(err.message));
          this.navigationService.setNewKeyValue(undefined);

          if (this.shouldCreateNew) {
            this.shouldCreateNew = false;
            this.backendCreate();
          }
        })
      )
      .subscribe();

    this.subscriptions.plusOne = this.table.rowDelete
      .pipe(
        tap(questionAndAnswer => {
          questionAndAnswerController
            .removeQuestionAnswer(questionAndAnswer.row)
            .catch((err: Error) => this.msg.info(err.message));
        })
      )
      .subscribe();
    this.subscriptions.plusOne = this.navigationService.activePoint
      .pipe(
        tap(() => {
          // saves active row on project change
          if (!!this.table?.expandedRow)
            questionAndAnswerController
              .updateQuestionAnswer(this.table.expandedRow)
              .catch((err: Error) => this.msg.info(err.message));

          // resubscribse to data of the new project
          this.dataSubscriptions.unsubscribe();
          this.initDataSubscriptions();
        })
      )
      .subscribe();
  }

  $: PausableObservable<QuestionAndAnswerTableModel[]>;
  initDataSubscriptions(): void {
    this.$ = questionAndAnswerController.getAll$(this.navigationService.currentPoint.projectId).pipe(
      tap(v => {
        this.questionAndAnswerData = v;

        // opens selecten row if needed
        if (this.firstLoad) {
          this.firstLoad = false;
          if (this.table?.expandedRow?.tableId !== this.navigationService.currentPoint.keyValuePair?.value)
            setTimeout(() => {
              this.table.activateRowByPair(this.navigationService.currentPoint.keyValuePair);
            }, ExpandTimings.REGULAR);
        }

        if (this.shouldFocus) {
          this.shouldFocus = false;
          setTimeout(() => this.table.activateRowByPair({ key: 'name', value: '' }), ExpandTimings.REGULAR);
        }
      }),
      pausable()
    ) as PausableObservable<QuestionAndAnswerTableModel[]>;
    this.dataSubscriptions.plusOne = this.$.subscribe();
  }
  createQuestionAndAnswers(): void {
    // checks if a hazard has no name, then don't create another
    if (
      this.shouldCreateNew ||
      this.questionAndAnswerData.filter(
        questionAndAnswer => !questionAndAnswer?.name && questionAndAnswer.name.length <= 0
      )?.length > 0
    )
      return;
    if (!!this.table.expandedRow) {
      this.shouldCreateNew = true;
      this.table.collapseRows();
    } else this.backendCreate();
  }

  backendCreate(): void {
    this.shouldFocus = true;
    questionAndAnswerController
      .createQuestionAnswer({
        ...new QuestionAndAnswer(),
        projectId: this.navigationService.currentPoint.projectId,
      })
      .catch((err: Error) => {
        this.msg.info(err.message);
        this.shouldFocus = false;
      });
  }
  ngOnDestroy(): void {
    if (this.table.expandedRow) questionAndAnswerController.updateQuestionAnswer(this.table.expandedRow);
    this.dataSubscriptions.unsubscribe();
    this.subscriptions.unsubscribe();
  }

  columns: ColumnDefinition[] = [
    { label: 'ID', key: 'id', searchable: false },
    { label: 'CAST.QUESTIONANDANSWER.QUESTION', key: 'name', searchable: true },
    { label: 'CAST.QUESTIONANDANSWER.ANSWER', key: 'description', searchable: true },
    { label: 'CAST.QUESTIONANDANSWER.COMPONENT', key: 'symbol', searchable: true, hidden: true },
  ];
  constructor(
    translate: TranslateService,
    private readonly navigationService: AppNavigationService,
    private readonly msg: MessageService
  ) {
    translate
      .get(['CAST.QUESTIONANDANSWER.QUESTION', 'CAST.QUESTIONANDANSWER.ANSWER', 'CAST.QUESTIONANDANSWER.COMPONENT'])
      .pipe(
        tap(res => {
          this.columns = [
            { label: res['CAST.QUESTIONANDANSWER.QUESTION'], key: 'name', searchable: true },
            { label: res['CAST.QUESTIONANDANSWER.ANSWER'], key: 'description', searchable: true },
            { label: res['CAST.QUESTIONANDANSWER.COMPONENT'], key: 'symbol', searchable: true, hidden: true },
          ];
        })
      )
      .subscribe();
  }
}
