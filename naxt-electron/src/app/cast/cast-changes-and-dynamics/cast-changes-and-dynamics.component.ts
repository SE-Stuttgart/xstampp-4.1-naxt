import { AfterViewInit, Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { Chip, ColumnDefinition, ExpandTimings, Subscriptions, TableComponent } from '@shared/index';
import { AppNavigationService, KeyValuePair, MessageService } from '@core/index';
import {
  changesAndDynamicsOverTimeController,
  ChangesAndDynamicsOverTimeDescription,
  ChangesAndDynamicsOverTimeTableModel,
  QuestionAndAnswer,
  questionAndAnswerController,
} from '@cast/index';
import { tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { pausable, PausableObservable } from '@shared/utils/PausableObservable';

@Component({
  selector: 'naxt-cast-changes-and-dynamics',
  templateUrl: './cast-changes-and-dynamics.component.html',
  styleUrls: ['./cast-changes-and-dynamics.component.scss'],
})
export class CastChangesAndDynamicsComponent implements AfterViewInit, OnDestroy {
  @Input() changesAndDynamicsOverTimeId: number = 1;
  private readonly subscriptions: Subscriptions = new Subscriptions();
  private readonly dataSubscriptions: Subscriptions = new Subscriptions();
  textOfTextfield: string = '';
  @ViewChild(TableComponent) table: TableComponent<ChangesAndDynamicsOverTimeTableModel>;
  changesAndDynamicsOverTime: ChangesAndDynamicsOverTimeDescription;

  changesAndDynamicsOverTimeData: ChangesAndDynamicsOverTimeTableModel[] = [];
  private shouldCreateNew: boolean = false;
  private shouldFocus: boolean = false;
  private firstLoad: boolean = true;

  ngAfterViewInit(): void {
    this.subscriptions.plusOne = this.table.rowExpanded
      .pipe(
        tap(changesAndDynamicsOverTime => {
          this.navigationService.setNewKeyValue(new KeyValuePair(changesAndDynamicsOverTime.tableId));
        })
      )
      .subscribe();

    this.subscriptions.plusOne = this.table.rowCollapsed
      .pipe(
        tap(changesAndDynamicsOverTime => {
          changesAndDynamicsOverTimeController
            .update(changesAndDynamicsOverTime)
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
        tap(changesAndDynamicsOverTime => {
          changesAndDynamicsOverTimeController
            .remove(changesAndDynamicsOverTime.row)
            .catch((err: Error) => this.msg.info(err.message));
        })
      )
      .subscribe();

    this.subscriptions.plusOne = this.navigationService.activePoint
      .pipe(
        tap(() => {
          // saves active row on project change
          if (!!this.table?.expandedRow)
            changesAndDynamicsOverTimeController
              .update(this.table.expandedRow)
              .catch((err: Error) => this.msg.info(err.message));

          // resubscribse to data of the new project
          this.dataSubscriptions.unsubscribe();
          this.initDataSubscriptions();
        })
      )
      .subscribe();
  }

  $: PausableObservable<ChangesAndDynamicsOverTimeTableModel[]>;
  initDataSubscriptions(): void {
    this.dataSubscriptions.plusOne = changesAndDynamicsOverTimeController
      .getDescription$(this.navigationService.currentPoint.projectId)
      .pipe(
        tap(v => {
          this.changesAndDynamicsOverTime = v;
        })
      )
      .subscribe();

    this.$ = changesAndDynamicsOverTimeController.getAll$(this.navigationService.currentPoint.projectId).pipe(
      tap(v => {
        this.changesAndDynamicsOverTimeData = v;

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
    ) as PausableObservable<ChangesAndDynamicsOverTimeTableModel[]>;
    this.dataSubscriptions.plusOne = this.$.subscribe();
  }

  createChangesAndDynamicsOverTime(): void {
    // checks if a hazard has no name, then don't create another
    if (
      this.shouldCreateNew ||
      this.changesAndDynamicsOverTimeData.filter(
        changesAndDynamicsOverTime => !changesAndDynamicsOverTime?.name && changesAndDynamicsOverTime.name.length <= 0
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
    changesAndDynamicsOverTimeController.create(this.navigationService.currentPoint.projectId).catch((err: Error) => {
      this.msg.info(err.message);
      this.shouldFocus = false;
    });
  }

  createCADQuestionLink(question: string): void {
    const qna: QuestionAndAnswer = {
      ...new QuestionAndAnswer(),
      projectId: this.navigationService.currentPoint.projectId,
      name: question,
    };

    questionAndAnswerController.createQuestionAnswer(qna).then(qnaAnswer => {
      questionAndAnswerController
        .createChangesAndDynamicsOverTimeLink(
          this.navigationService.currentPoint.projectId,
          this.table.expandedRow.id,
          qnaAnswer.id
        )
        .catch((err: Error) => this.msg.info(err.message));
    });
  }
  ngOnDestroy(): void {
    if (this.table.expandedRow) changesAndDynamicsOverTimeController.update(this.table.expandedRow);
    this.subscriptions.unsubscribe();
    this.dataSubscriptions.unsubscribe();
    this.save();
  }

  addControllerLink(changesAndDynamicsOverTime: ChangesAndDynamicsOverTimeTableModel, chip: Chip): void {
    this.$.pause();
    changesAndDynamicsOverTimeController
      .update(changesAndDynamicsOverTime)
      .then(() =>
        changesAndDynamicsOverTimeController
          .createControllerLink({
            projectId: this.navigationService.currentPoint.projectId,
            changesAndDynamicsOverTimeId: changesAndDynamicsOverTime.id,
            controllerId: Number(chip.id),
          })
          .catch((err: Error) => this.msg.info(err.message))
      )
      .then(() => this.$.resume())
      .catch((err: Error) => this.msg.info(err.message));
  }

  removeControllerLink(changesAndDynamicsOverTime: ChangesAndDynamicsOverTimeTableModel, chip: Chip): void {
    this.$.pause();
    changesAndDynamicsOverTimeController
      .update(changesAndDynamicsOverTime)
      .then(() =>
        changesAndDynamicsOverTimeController
          .removeControllerLink({
            controllerId: Number(chip.id),
            changesAndDynamicsOverTimeId: changesAndDynamicsOverTime.id,
            projectId: this.navigationService.currentPoint.projectId,
          })
          .catch((err: Error) => this.msg.info(err.message))
      )
      .then(() => this.$.resume())
      .catch((err: Error) => this.msg.info(err.message));
  }

  save(): void {
    changesAndDynamicsOverTimeController.updateDescription(this.changesAndDynamicsOverTime);
  }
  columns: ColumnDefinition[] = [
    { label: 'ID', key: 'id', searchable: false },
    { label: 'CAST.CHANGESANDDYNAMICSOVERTIME.NAME', key: 'name', searchable: true },
    { label: 'Description', key: 'description', searchable: true, hidden: true },
  ];

  constructor(
    translate: TranslateService,
    private readonly msg: MessageService,
    private readonly navigationService: AppNavigationService
  ) {
    translate
      .get(['CAST.CHANGESANDDYNAMICSOVERTIME.NAME', 'CAST.CHANGESANDDYNAMICSOVERTIME.TITLE'])
      .pipe(
        tap(res => {
          this.columns = [
            { label: res['CAST.CHANGESANDDYNAMICSOVERTIME.NAME'], key: 'name', searchable: true },
            { label: 'Description', key: 'description', searchable: true, hidden: true },
          ];
        })
      )
      .subscribe();
  }
}
