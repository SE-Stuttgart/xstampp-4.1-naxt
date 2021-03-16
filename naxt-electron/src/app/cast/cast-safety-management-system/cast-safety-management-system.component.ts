import { AfterViewInit, Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { Chip, ColumnDefinition, ExpandTimings, Subscriptions, TableComponent, UpdateTiming } from '@shared/index';
import { AppNavigationService, KeyValuePair, MessageService } from '@core/index';
import { auditTime, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import {
  QuestionAndAnswer,
  questionAndAnswerController,
  safetyManagementSystemController,
  SafetyManagementSystemDescription,
  SafetyManagementSystemTableModel,
} from '@cast/index';
import { pausable, PausableObservable } from '@shared/utils/PausableObservable';

@Component({
  selector: 'naxt-cast-safety-management-system',
  templateUrl: './cast-safety-management-system.component.html',
  styleUrls: ['./cast-safety-management-system.component.scss'],
})
export class CastSafetyManagementSystemComponent implements AfterViewInit, OnDestroy {
  @Input() safetyCultureManagmentId: number = 1;
  private readonly subscriptions: Subscriptions = new Subscriptions();
  private readonly dataSubscriptions: Subscriptions = new Subscriptions();
  textOfTextfield: string = '';
  @ViewChild(TableComponent) table: TableComponent<SafetyManagementSystemTableModel>;
  safetyManagementSystem: SafetyManagementSystemDescription;

  safetyManagementSystemData: SafetyManagementSystemTableModel[] = [];
  private shouldCreateNew: boolean = false;
  private shouldFocus: boolean = false;
  private firstLoad: boolean = false;

  ngAfterViewInit(): void {
    this.subscriptions.plusOne = this.table.rowExpanded
      .pipe(
        tap(safetyManagementSystem => {
          this.navigationService.setNewKeyValue(new KeyValuePair(safetyManagementSystem.tableId));
        })
      )
      .subscribe();

    this.subscriptions.plusOne = this.table.rowCollapsed
      .pipe(
        tap(safetyManagementSystem => {
          safetyManagementSystemController
            .update(safetyManagementSystem)
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
        tap(safetyManagementSystem => {
          safetyManagementSystemController
            .remove(safetyManagementSystem.row)
            .catch((err: Error) => this.msg.info(err.message));
        })
      )
      .subscribe();

    this.subscriptions.plusOne = this.navigationService.activePoint
      .pipe(
        tap(() => {
          // saves active row on project change
          if (!!this.table?.expandedRow)
            safetyManagementSystemController
              .update(this.table.expandedRow)
              .catch((err: Error) => this.msg.info(err.message));

          // resubscribse to data of the new project
          this.dataSubscriptions.unsubscribe();
          this.initDataSubscriptions();
        })
      )
      .subscribe();
  }

  $: PausableObservable<SafetyManagementSystemTableModel[]>;
  initDataSubscriptions(): void {
    this.dataSubscriptions.plusOne = safetyManagementSystemController
      .getDescription$(this.navigationService.currentPoint.projectId)
      .pipe(
        tap(v => {
          this.safetyManagementSystem = v;

          // opens selecten row if needed
          if (this.firstLoad) {
            this.firstLoad = false;
            if (this.table?.expandedRow?.tableId !== this.navigationService.currentPoint.keyValuePair?.value)
              setTimeout(() => {
                this.table.activateRowByPair(this.navigationService.currentPoint.keyValuePair);
              }, ExpandTimings.REGULAR);
          }
        })
      )
      .subscribe();

    this.$ = safetyManagementSystemController.getAll$(this.navigationService.currentPoint.projectId).pipe(
      tap(v => {
        this.safetyManagementSystemData = v;
        if (this.shouldFocus) {
          this.shouldFocus = false;
          setTimeout(() => this.table.activateRowByPair({ key: 'name', value: '' }), ExpandTimings.REGULAR);
        }
      }),
      pausable()
    ) as PausableObservable<SafetyManagementSystemTableModel[]>;
    this.dataSubscriptions.plusOne = this.$.subscribe();
  }

  createSafetyManagementSystem(): void {
    // checks if a hazard has no name, then don't create another
    if (
      this.shouldCreateNew ||
      this.safetyManagementSystemData.filter(
        safetyManagementSystem => !safetyManagementSystem?.name && safetyManagementSystem.name.length <= 0
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
    safetyManagementSystemController.create(this.navigationService.currentPoint.projectId).catch((err: Error) => {
      this.msg.info(err.message);
      this.shouldFocus = false;
    });
  }
  createSMSQuestionLink(question: string): void {
    const qna: QuestionAndAnswer = {
      ...new QuestionAndAnswer(),
      projectId: this.navigationService.currentPoint.projectId,
      name: question,
    };

    questionAndAnswerController.createQuestionAnswer(qna).then(qnaAnswer => {
      questionAndAnswerController
        .createSafetyManagementSystemLink(
          this.navigationService.currentPoint.projectId,
          this.table.expandedRow.id,
          qnaAnswer.id
        )
        .catch((err: Error) => this.msg.info(err.message));
    });
  }
  ngOnDestroy(): void {
    if (this.table.expandedRow) safetyManagementSystemController.update(this.table.expandedRow);
    this.subscriptions.unsubscribe();
    this.dataSubscriptions.unsubscribe();
    this.save();
  }
  addControllerLink(safetyManagementSystem: SafetyManagementSystemTableModel, chip: Chip): void {
    this.$.pause();
    safetyManagementSystemController
      .update(safetyManagementSystem)
      .then(() =>
        safetyManagementSystemController
          .createControllerLink({
            projectId: this.navigationService.currentPoint.projectId,
            safetyManagementSystemId: safetyManagementSystem.id,
            controllerId: Number(chip.id),
          })
          .catch((err: Error) => this.msg.info(err.message))
      )
      .then(() => this.$.resume())
      .catch((err: Error) => this.msg.info(err.message));
  }

  removeControllerLink(safetyManagementSystem: SafetyManagementSystemTableModel, chip: Chip): void {
    this.$.pause();
    safetyManagementSystemController
      .update(safetyManagementSystem)
      .then(() =>
        safetyManagementSystemController
          .removeControllerLink({
            controllerId: Number(chip.id),
            safetyManagementSystemId: safetyManagementSystem.id,
            projectId: this.navigationService.currentPoint.projectId,
          })
          .catch((err: Error) => this.msg.info(err.message))
      )
      .then(() => this.$.resume())
      .catch((err: Error) => this.msg.info(err.message));
  }

  save(): void {
    safetyManagementSystemController.updateDescription(this.safetyManagementSystem);
  }
  columns: ColumnDefinition[] = [
    { label: 'ID', key: 'id', searchable: false },
    { label: 'CAST.SAFETYMANAGEMENTSYSTEM.NAME', key: 'name', searchable: true },
    { label: 'Description', key: 'description', searchable: true, hidden: true },
  ];

  constructor(
    translate: TranslateService,
    private readonly msg: MessageService,
    private readonly navigationService: AppNavigationService
  ) {
    translate
      .get(['CAST.SAFETYMANAGEMENTSYSTEM.NAME', 'CAST.SAFETYMANAGEMENTSYSTEM.TITLE'])
      .pipe(
        tap(res => {
          this.columns = [
            { label: res['CAST.SAFETYMANAGEMENTSYSTEM.NAME'], key: 'name', searchable: true },
            { label: 'Description', key: 'description', searchable: true, hidden: true },
          ];
        })
      )
      .subscribe();
  }
}
