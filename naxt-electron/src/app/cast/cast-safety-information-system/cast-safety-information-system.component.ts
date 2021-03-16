import { AfterViewInit, Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { Chip, ColumnDefinition, ExpandTimings, Subscriptions, TableComponent } from '@shared/index';
import { AppNavigationService, KeyValuePair, MessageService } from '@core/index';
import { tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import {
  QuestionAndAnswer,
  questionAndAnswerController,
  safetyInformationSystemController,
  SafetyInformationSystemDescription,
  SafetyInformationSystemTableModel,
} from '@cast/index';
import { pausable, PausableObservable } from '@shared/utils/PausableObservable';

@Component({
  selector: 'naxt-cast-safety-information-system',
  templateUrl: './cast-safety-information-system.component.html',
  styleUrls: ['./cast-safety-information-system.component.scss'],
})
export class CastSafetyInformationSystemComponent implements AfterViewInit, OnDestroy {
  @Input() safetyCultureManagmentId: number = 1;
  private readonly subscriptions: Subscriptions = new Subscriptions();
  private readonly dataSubscriptions: Subscriptions = new Subscriptions();
  textOfTextfield: string = '';
  @ViewChild(TableComponent) table: TableComponent<SafetyInformationSystemTableModel>;
  safetyInformationSystem: SafetyInformationSystemDescription;

  safetyInformationSystemData: SafetyInformationSystemTableModel[] = [];
  private shouldCreateNew: boolean = false;
  private shouldFocus: boolean = false;
  private firstLoad: boolean = false;

  ngAfterViewInit(): void {
    this.subscriptions.plusOne = this.table.rowExpanded
      .pipe(
        tap(safetyInformationSystem => {
          this.navigationService.setNewKeyValue(new KeyValuePair(safetyInformationSystem.tableId));
        })
      )
      .subscribe();

    this.subscriptions.plusOne = this.table.rowCollapsed
      .pipe(
        tap(safetyInformationSystem => {
          safetyInformationSystemController
            .update(safetyInformationSystem)
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
        tap(safetyInformationSystem => {
          safetyInformationSystemController
            .remove(safetyInformationSystem.row)
            .catch((err: Error) => this.msg.info(err.message));
        })
      )
      .subscribe();

    this.subscriptions.plusOne = this.navigationService.activePoint
      .pipe(
        tap(() => {
          // saves active row on project change
          if (!!this.table?.expandedRow)
            safetyInformationSystemController
              .update(this.table.expandedRow)
              .catch((err: Error) => this.msg.info(err.message));

          // resubscribse to data of the new project
          this.dataSubscriptions.unsubscribe();
          this.initDataSubscriptions();
        })
      )
      .subscribe();
  }

  $: PausableObservable<SafetyInformationSystemTableModel[]>;
  initDataSubscriptions(): void {
    this.dataSubscriptions.plusOne = safetyInformationSystemController
      .getDescription$(this.navigationService.currentPoint.projectId)
      .pipe(
        tap(v => {
          this.safetyInformationSystem = v;

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

    this.$ = safetyInformationSystemController.getAll$(this.navigationService.currentPoint.projectId).pipe(
      tap(v => {
        this.safetyInformationSystemData = v;
        if (this.shouldFocus) {
          this.shouldFocus = false;
          setTimeout(() => this.table.activateRowByPair({ key: 'name', value: '' }), ExpandTimings.REGULAR);
        }
      }),
      pausable()
    ) as PausableObservable<SafetyInformationSystemTableModel[]>;
    this.dataSubscriptions.plusOne = this.$.subscribe();
  }

  createSafetyInformationSystem(): void {
    // checks if a hazard has no name, then don't create another
    if (
      this.shouldCreateNew ||
      this.safetyInformationSystemData.filter(
        safetyInformationSystem => !safetyInformationSystem?.name && safetyInformationSystem.name.length <= 0
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
    safetyInformationSystemController.create(this.navigationService.currentPoint.projectId).catch((err: Error) => {
      this.msg.info(err.message);
      this.shouldFocus = false;
    });
  }
  createSISQuestionLink(question: string): void {
    const qna: QuestionAndAnswer = {
      ...new QuestionAndAnswer(),
      projectId: this.navigationService.currentPoint.projectId,
      name: question,
    };

    questionAndAnswerController.createQuestionAnswer(qna).then(qnaAnswer => {
      questionAndAnswerController
        .createSafetyInformationSystemLink(
          this.navigationService.currentPoint.projectId,
          this.table.expandedRow.id,
          qnaAnswer.id
        )
        .catch((err: Error) => this.msg.info(err.message));
    });
  }
  ngOnDestroy(): void {
    if (this.table.expandedRow) safetyInformationSystemController.update(this.table.expandedRow);
    this.subscriptions.unsubscribe();
    this.dataSubscriptions.unsubscribe();
    this.save();
  }
  addControllerLink(safetyInformationSystem: SafetyInformationSystemTableModel, chip: Chip): void {
    this.$.pause();
    safetyInformationSystemController
      .update(safetyInformationSystem)
      .then(() =>
        safetyInformationSystemController
          .createControllerLink({
            projectId: this.navigationService.currentPoint.projectId,
            safetyInformationSystemId: safetyInformationSystem.id,
            controllerId: Number(chip.id),
          })
          .catch((err: Error) => this.msg.info(err.message))
      )
      .then(() => this.$.resume())
      .catch((err: Error) => this.msg.info(err.message));
  }

  removeControllerLink(safetyInformationSystem: SafetyInformationSystemTableModel, chip: Chip): void {
    this.$.pause();
    safetyInformationSystemController
      .update(safetyInformationSystem)
      .then(() =>
        safetyInformationSystemController
          .removeControllerLink({
            controllerId: Number(chip.id),
            safetyInformationSystemId: safetyInformationSystem.id,
            projectId: this.navigationService.currentPoint.projectId,
          })
          .catch((err: Error) => this.msg.info(err.message))
      )
      .then(() => this.$.resume())
      .catch((err: Error) => this.msg.info(err.message));
  }

  save(): void {
    safetyInformationSystemController.updateDescription(this.safetyInformationSystem);
  }
  columns: ColumnDefinition[] = [
    { label: 'ID', key: 'id', searchable: false },
    { label: 'CAST.SAFETYINFORMATIONSYSTEM.NAME', key: 'name', searchable: true },
    { label: 'Description', key: 'description', searchable: true, hidden: true },
  ];

  constructor(
    translate: TranslateService,
    private readonly msg: MessageService,
    private readonly navigationService: AppNavigationService
  ) {
    translate
      .get(['CAST.SAFETYINFORMATIONSYSTEM.NAME', 'CAST.SAFETYINFORMATIONSYSTEM.TITLE'])
      .pipe(
        tap(res => {
          this.columns = [
            { label: res['CAST.SAFETYINFORMATIONSYSTEM.NAME'], key: 'name', searchable: true },
            { label: 'Description', key: 'description', searchable: true, hidden: true },
          ];
        })
      )
      .subscribe();
  }
}
