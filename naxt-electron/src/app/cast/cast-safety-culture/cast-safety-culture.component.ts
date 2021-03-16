import { AfterViewInit, Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { Chip, ColumnDefinition, ExpandTimings, Subscriptions, TableComponent } from '@shared/index';
import {
  QuestionAndAnswer,
  questionAndAnswerController,
  safetyCultureController,
  SafetyCultureDescription,
  SafetyCultureTableModel,
} from '@cast/index';
import { AppNavigationService, KeyValuePair, MessageService } from '@core/index';
import { tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { pausable, PausableObservable } from '@shared/utils/PausableObservable';

@Component({
  selector: 'naxt-cast-safety-culture',
  templateUrl: './cast-safety-culture.component.html',
  styleUrls: ['./cast-safety-culture.component.scss'],
})
export class CastSafetyCultureComponent implements AfterViewInit, OnDestroy {
  @Input() safetyCultureManagmentId: number = 1;
  private readonly subscriptions: Subscriptions = new Subscriptions();
  private readonly dataSubscriptions: Subscriptions = new Subscriptions();

  @ViewChild(TableComponent) table: TableComponent<SafetyCultureTableModel>;
  safetyCulture: SafetyCultureDescription;

  safetyCultureData: SafetyCultureTableModel[] = [];
  private shouldCreateNew: boolean = false;
  private shouldFocus: boolean = false;
  private firstLoad: boolean = false;
  textOfTextfield: string = '';

  ngAfterViewInit(): void {
    this.subscriptions.plusOne = this.table.rowExpanded
      .pipe(
        tap(safetyCulture => {
          this.navigationService.setNewKeyValue(new KeyValuePair(safetyCulture.tableId));
        })
      )
      .subscribe();

    this.subscriptions.plusOne = this.table.rowCollapsed
      .pipe(
        tap(safetyCulture => {
          safetyCultureController.update(safetyCulture).catch((err: Error) => this.msg.info(err.message));
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
        tap(safetyCulture => {
          safetyCultureController.remove(safetyCulture.row).catch((err: Error) => this.msg.info(err.message));
        })
      )
      .subscribe();

    this.subscriptions.plusOne = this.navigationService.activePoint
      .pipe(
        tap(() => {
          // saves active row on project change
          if (!!this.table?.expandedRow)
            safetyCultureController.update(this.table.expandedRow).catch((err: Error) => this.msg.info(err.message));

          // resubscribse to data of the new project
          this.dataSubscriptions.unsubscribe();
          this.initDataSubscriptions();
        })
      )
      .subscribe();
  }

  $: PausableObservable<SafetyCultureTableModel[]>;
  initDataSubscriptions(): void {
    this.dataSubscriptions.plusOne = safetyCultureController
      .getDescription$(this.navigationService.currentPoint.projectId)
      .pipe(
        tap(v => {
          this.safetyCulture = v;
        })
      )
      .subscribe();

    this.$ = safetyCultureController.getAll$(this.navigationService.currentPoint.projectId).pipe(
      tap(v => {
        this.safetyCultureData = v;

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
    ) as PausableObservable<SafetyCultureTableModel[]>;
    this.dataSubscriptions.plusOne = this.$.subscribe();
  }

  createSafetyCulture(): void {
    // checks if a hazard has no name, then don't create another
    if (
      this.shouldCreateNew ||
      this.safetyCultureData.filter(safetyCulture => !safetyCulture?.name && safetyCulture.name.length <= 0)?.length > 0
    )
      return;
    if (!!this.table.expandedRow) {
      this.shouldCreateNew = true;
      this.table.collapseRows();
    } else this.backendCreate();
  }

  backendCreate(): void {
    this.shouldFocus = true;
    safetyCultureController.create(this.navigationService.currentPoint.projectId).catch((err: Error) => {
      this.msg.info(err.message);
      this.shouldFocus = false;
    });
  }

  createSafetyCultureQuestionLink(question: string): void {
    const qna: QuestionAndAnswer = {
      ...new QuestionAndAnswer(),
      projectId: this.navigationService.currentPoint.projectId,
      name: question,
    };

    questionAndAnswerController.createQuestionAnswer(qna).then(qnaAnswer => {
      questionAndAnswerController
        .createSafetyCultureLink(this.navigationService.currentPoint.projectId, this.table.expandedRow.id, qnaAnswer.id)
        .catch((err: Error) => this.msg.info(err.message));
    });
  }

  ngOnDestroy(): void {
    if (this.table.expandedRow) safetyCultureController.update(this.table.expandedRow);
    this.subscriptions.unsubscribe();
    this.dataSubscriptions.unsubscribe();
    this.save();
  }

  addControllerLink(safetyCulture: SafetyCultureTableModel, chip: Chip): void {
    this.$.pause();
    safetyCultureController
      .update(safetyCulture)
      .then(() =>
        safetyCultureController
          .createControllerLink({
            projectId: this.navigationService.currentPoint.projectId,
            safetyCultureId: safetyCulture.id,
            controllerId: Number(chip.id),
          })
          .catch((err: Error) => this.msg.info(err.message))
      )
      .then(() => this.$.resume())
      .catch((err: Error) => this.msg.info(err.message));
  }

  removeControllerLink(safetyCulture: SafetyCultureTableModel, chip: Chip): void {
    this.$.pause();
    safetyCultureController
      .update(safetyCulture)
      .then(() =>
        safetyCultureController
          .removeControllerLink({
            controllerId: Number(chip.id),
            safetyCultureId: safetyCulture.id,
            projectId: this.navigationService.currentPoint.projectId,
          })
          .catch((err: Error) => this.msg.info(err.message))
      )
      .then(() => this.$.resume())
      .catch((err: Error) => this.msg.info(err.message));
  }

  save(): void {
    safetyCultureController.updateDescription(this.safetyCulture);
  }

  columns: ColumnDefinition[] = [
    { label: 'ID', key: 'id', searchable: false },
    { label: 'CAST.SAFETYCULTURE.NAME', key: 'name', searchable: true },
    { label: 'Description', key: 'description', searchable: true, hidden: true },
  ];

  constructor(
    translate: TranslateService,
    private readonly msg: MessageService,
    private readonly navigationService: AppNavigationService
  ) {
    translate
      .get(['CAST.SAFETYCULTURE.NAME', 'CAST.SAFETYCULTURE.TITLE'])
      .pipe(
        tap(res => {
          this.columns = [
            { label: res['CAST.SAFETYCULTURE.NAME'], key: 'name', searchable: true },
            { label: 'Description', key: 'description', searchable: true, hidden: true },
          ];
        })
      )
      .subscribe();
  }
}
