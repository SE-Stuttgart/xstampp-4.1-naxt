import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { eventController, QuestionAndAnswer, questionAndAnswerController } from '@cast/index';
import { AppNavigationService, KeyValuePair, MessageService } from '@core/index';
import { TranslateService } from '@ngx-translate/core';
import { ColumnDefinition, ExpandTimings, Subscriptions, TableComponent } from '@shared/index';
import { tap } from 'rxjs/operators';
import { EventTableModel } from '@cast/src/main/services/models';
import { pausable, PausableObservable } from '@shared/utils/PausableObservable';

@Component({
  selector: 'naxt-cast-event',
  templateUrl: './cast-event.component.html',
  styleUrls: ['./cast-event.component.scss'],
})
export class CastEventComponent implements AfterViewInit, OnDestroy {
  private readonly subscriptions: Subscriptions = new Subscriptions();
  private readonly dataSubscriptions: Subscriptions = new Subscriptions();
  $: PausableObservable<EventTableModel[]>;
  textOfTextfield: string = '';

  @ViewChild(TableComponent) table: TableComponent<EventTableModel>;
  eventData: EventTableModel[] = [];
  private shouldCreateNew: boolean = false;
  private shouldFocus: boolean = false;
  private firstLoad: boolean = false;

  ngAfterViewInit(): void {
    this.subscriptions.plusOne = this.table.rowExpanded
      .pipe(
        tap(event => {
          this.navigationService.setNewKeyValue(new KeyValuePair(event.tableId));
        })
      )
      .subscribe();

    this.subscriptions.plusOne = this.table.rowCollapsed
      .pipe(
        tap(event => {
          eventController.update(event).catch((err: Error) => this.msg.info(err.message));
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
        tap(event => {
          eventController.remove(event.row).catch((err: Error) => this.msg.info(err.message));
        })
      )
      .subscribe();
    this.subscriptions.plusOne = this.navigationService.activePoint
      .pipe(
        tap(() => {
          // saves active row on project change
          if (!!this.table?.expandedRow)
            eventController.update(this.table.expandedRow).catch((err: Error) => this.msg.info(err.message));

          // resubscribse to data of the new project
          this.dataSubscriptions.unsubscribe();
          this.initDataSubscriptions();
        })
      )
      .subscribe();
  }
  initDataSubscriptions(): void {
    this.$ = eventController.getAll$(this.navigationService.currentPoint.projectId).pipe(
      tap(v => {
        this.eventData = v;

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
    ) as PausableObservable<EventTableModel[]>;

    this.dataSubscriptions.plusOne = this.$.subscribe();
  }
  createEvent(): void {
    // checks if a hazard has no name, then don't create another
    if (this.shouldCreateNew || this.eventData.filter(event => !event?.name && event.name.length <= 0)?.length > 0)
      return;
    if (!!this.table.expandedRow) {
      this.shouldCreateNew = true;
      this.table.collapseRows();
    } else this.backendCreate();
  }

  backendCreate(): void {
    this.shouldFocus = true;
    eventController.create(this.navigationService.currentPoint.projectId).catch((err: Error) => {
      this.msg.info(err.message);
      this.shouldFocus = false;
    });
  }
  ngOnDestroy(): void {
    if (this.table.expandedRow) eventController.update(this.table.expandedRow);
    this.dataSubscriptions.unsubscribe();
    this.subscriptions.unsubscribe();
  }

  createEventQuestionLink(question: string): void {
    const qna: QuestionAndAnswer = {
      ...new QuestionAndAnswer(),
      projectId: this.navigationService.currentPoint.projectId,
      name: question,
    };
    questionAndAnswerController.createQuestionAnswer(qna).then(qnaAnswer => {
      questionAndAnswerController
        .createEventLink(this.navigationService.currentPoint.projectId, this.table.expandedRow.id, qnaAnswer.id)
        .catch((err: Error) => this.msg.info(err.message));
    });
  }

  columns: ColumnDefinition[] = [
    { label: 'ID', key: 'id', searchable: false },
    { label: 'Description', key: 'name', searchable: true },
  ];
  constructor(
    translate: TranslateService,
    private readonly navigationService: AppNavigationService,
    private readonly msg: MessageService
  ) {
    translate
      .get(['CAST.EVENTS.NAME', 'CAST.EVENTS.TITLE'])
      .pipe(
        tap(res => {
          this.columns = [
            //{ label: res['CAST.EVENTS.NAME'], key: 'name', searchable: true },
            { label: 'Description', key: 'name', searchable: true },
          ];
        })
      )
      .subscribe();
  }
}
