import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import {
  constraintController,
  ConstraintTableModel,
  QuestionAndAnswer,
  questionAndAnswerController,
} from '@cast/index';
import { AppNavigationService, KeyValuePair, MessageService } from '@core/index';
import { TranslateService } from '@ngx-translate/core';
import { Chip, ColumnDefinition, ExpandTimings, Subscriptions, TableComponent } from '@shared/index';
import { pausable, PausableObservable } from '@shared/utils/PausableObservable';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'naxt-cast-constraint',
  templateUrl: './cast-constraint.component.html',
  styleUrls: ['./cast-constraint.component.scss'],
})
export class CastConstraintComponent implements AfterViewInit, OnDestroy {
  private readonly subscriptions: Subscriptions = new Subscriptions();
  private readonly dataSubscriptions: Subscriptions = new Subscriptions();
  textOfTextfield: string = '';
  @ViewChild(TableComponent) table: TableComponent<ConstraintTableModel>;

  private $: PausableObservable<ConstraintTableModel[]>;
  constraintData: ConstraintTableModel[] = [];
  private shouldCreateNew: boolean = false;
  private shouldFocus: boolean = false;
  private firstLoad: boolean = true;

  ngAfterViewInit(): void {
    this.subscriptions.plusOne = this.table.rowExpanded
      .pipe(
        tap(constraint => {
          this.navigationService.setNewKeyValue(new KeyValuePair(constraint.tableId));
        })
      )
      .subscribe();

    this.subscriptions.plusOne = this.table.rowCollapsed
      .pipe(
        tap(constraint => {
          constraintController.update(constraint).catch((err: Error) => this.msg.info(err.message));
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
        tap(constraint => {
          constraintController.remove(constraint.row).catch((err: Error) => this.msg.info(err.message));
        })
      )
      .subscribe();

    this.subscriptions.plusOne = this.navigationService.activePoint
      .pipe(
        tap(() => {
          // saves active row on project change
          if (!!this.table?.expandedRow)
            constraintController.update(this.table.expandedRow).catch((err: Error) => this.msg.info(err.message));

          // resubscribse to data of the new project
          this.dataSubscriptions.unsubscribe();
          this.initDataSubscriptions();
        })
      )
      .subscribe();
  }

  initDataSubscriptions(): void {
    this.$ = constraintController.getAll$(this.navigationService.currentPoint.projectId).pipe(
      // auditTime(UpdateTiming.LONG),
      tap(v => {
        this.constraintData = v;

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
    ) as PausableObservable<ConstraintTableModel[]>;
    this.dataSubscriptions.plusOne = this.$.subscribe();
  }

  createConstraint(): void {
    // checks if a hazard has no name, then don't create another
    if (
      this.shouldCreateNew ||
      this.constraintData.filter(constraint => !constraint?.name && constraint.name.length <= 0)?.length > 0
    )
      return;
    if (!!this.table.expandedRow) {
      this.shouldCreateNew = true;
      this.table.collapseRows();
    } else this.backendCreate();
  }

  backendCreate(): void {
    this.shouldFocus = true;
    constraintController.create(this.navigationService.currentPoint.projectId).catch((err: Error) => {
      this.msg.info(err.message);
      this.shouldFocus = false;
    });
  }

  addHazardLink(constraint: ConstraintTableModel, chip: Chip): void {
    this.$.pause();
    Promise.all([
      constraintController.update(constraint),
      constraintController.createHazardLink({
        projectId: this.navigationService.currentPoint.projectId,
        constraintId: constraint.id,
        hazardId: chip.id as string,
      }),
    ])
      .then(() => this.$.resume())
      .catch((err: Error) => this.msg.info(err.message));
  }

  removeHazardLink(constraint: ConstraintTableModel, chip: Chip): void {
    this.$.pause();
    Promise.all([
      constraintController.update(constraint),
      constraintController.removeHazardLink({
        hazardId: chip.id as string,
        constraintId: constraint.id,
        projectId: this.navigationService.currentPoint.projectId,
      }),
    ])
      .then(() => this.$.resume())
      .catch((err: Error) => this.msg.info(err.message));
  }

  createConstraintQuestionLink(question: string): void {
    const qna: QuestionAndAnswer = {
      ...new QuestionAndAnswer(),
      projectId: this.navigationService.currentPoint.projectId,
      name: question,
    };
    questionAndAnswerController.createQuestionAnswer(qna).then(qnaAnswer => {
      questionAndAnswerController
        .createConstraintLink(this.navigationService.currentPoint.projectId, this.table.expandedRow.id, qnaAnswer.id)
        .catch((err: Error) => this.msg.info(err.message));
    });
  }

  ngOnDestroy(): void {
    if (this.table.expandedRow) constraintController.update(this.table.expandedRow);
    this.dataSubscriptions.unsubscribe();
    this.subscriptions.unsubscribe();
  }

  columns: ColumnDefinition[] = [
    { label: 'ID', key: 'id', searchable: false },
    { label: 'CAST.CONSTRAINTS.NAME', key: 'name', searchable: true },
    { label: 'Description', key: 'description', searchable: true, hidden: true },
  ];

  constructor(
    translate: TranslateService,
    private readonly navigationService: AppNavigationService,
    private readonly msg: MessageService
  ) {
    translate
      .get(['CAST.CONSTRAINTS.NAME', 'CAST.CONSTRAINTS.TITLE'])
      .pipe(
        tap(res => {
          this.columns = [
            { label: res['CAST.CONSTRAINTS.NAME'], key: 'name', searchable: true },
            { label: 'Description', key: 'description', searchable: true, hidden: true },
          ];
        })
      )
      .subscribe();
  }
}
