import { AfterViewInit, Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { Chip, ColumnDefinition, ExpandTimings, Subscriptions, TableComponent } from '@shared/index';
import { TranslateService } from '@ngx-translate/core';
import { AppNavigationService, KeyValuePair, MessageService } from '@core/index';
import {
  internalAndExternalEconomicsController,
  InternalAndExternalEconomicsDescription,
  InternalAndExternalEconomicsTableModel,
  QuestionAndAnswer,
  questionAndAnswerController,
} from '@cast/index';
import { tap } from 'rxjs/operators';
import { pausable, PausableObservable } from '@shared/utils/PausableObservable';

@Component({
  selector: 'naxt-cast-internal-and-external-economics',
  templateUrl: './cast-internal-and-external-economics.component.html',
  styleUrls: ['./cast-internal-and-external-economics.component.scss'],
})
export class CastInternalAndExternalEconomicsComponent implements AfterViewInit, OnDestroy {
  @Input() internalAndExternalEconomicsId: number = 1;
  private readonly subscriptions: Subscriptions = new Subscriptions();
  private readonly dataSubscriptions: Subscriptions = new Subscriptions();
  private firstLoad: boolean = true;
  textOfTextfield: string = '';
  @ViewChild(TableComponent) table: TableComponent<InternalAndExternalEconomicsTableModel>;
  internalAndExternalEconomics: InternalAndExternalEconomicsDescription;

  internalAndExternalData: InternalAndExternalEconomicsTableModel[] = [];
  private shouldCreateNew: boolean = false;
  private shouldFocus: boolean = false;

  ngAfterViewInit(): void {
    this.subscriptions.plusOne = this.table.rowExpanded
      .pipe(
        tap(internalAndExternal => {
          this.navigationService.setNewKeyValue(new KeyValuePair(internalAndExternal.tableId));
        })
      )
      .subscribe();

    this.subscriptions.plusOne = this.table.rowCollapsed
      .pipe(
        tap(internalAndExternal => {
          internalAndExternalEconomicsController
            .update(internalAndExternal)
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
        tap(internalAndExternal => {
          internalAndExternalEconomicsController
            .remove(internalAndExternal.row)
            .catch((err: Error) => this.msg.info(err.message));
        })
      )
      .subscribe();

    this.subscriptions.plusOne = this.navigationService.activePoint
      .pipe(
        tap(() => {
          // saves active row on project change
          if (!!this.table?.expandedRow)
            internalAndExternalEconomicsController
              .update(this.table.expandedRow)
              .catch((err: Error) => this.msg.info(err.message));

          // resubscribse to data of the new project
          this.dataSubscriptions.unsubscribe();
          this.initDataSubscriptions();
        })
      )
      .subscribe();
  }

  $: PausableObservable<InternalAndExternalEconomicsTableModel[]>;
  initDataSubscriptions(): void {
    this.dataSubscriptions.plusOne = internalAndExternalEconomicsController
      .getDescription$(this.navigationService.currentPoint.projectId)
      .pipe(
        tap(v => {
          this.internalAndExternalEconomics = v;
        })
      )
      .subscribe();

    this.$ = internalAndExternalEconomicsController.getAll$(this.navigationService.currentPoint.projectId).pipe(
      tap(v => {
        this.internalAndExternalData = v;

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
    ) as PausableObservable<InternalAndExternalEconomicsTableModel[]>;
    this.dataSubscriptions.plusOne = this.$.subscribe();
  }

  createInternalAndExternalEconomics(): void {
    // checks if a hazard has no name, then don't create another
    if (
      this.shouldCreateNew ||
      this.internalAndExternalData.filter(
        internalAndExternal => !internalAndExternal?.name && internalAndExternal.name.length <= 0
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
    internalAndExternalEconomicsController.create(this.navigationService.currentPoint.projectId).catch((err: Error) => {
      this.msg.info(err.message);
      this.shouldFocus = false;
    });
  }
  createIAEQuestionLink(question: string): void {
    const qna: QuestionAndAnswer = {
      ...new QuestionAndAnswer(),
      projectId: this.navigationService.currentPoint.projectId,
      name: question,
    };

    questionAndAnswerController.createQuestionAnswer(qna).then(qnaAnswer => {
      questionAndAnswerController
        .createInternalAndExternalEconomicsLink(
          this.navigationService.currentPoint.projectId,
          this.table.expandedRow.id,
          qnaAnswer.id
        )
        .catch((err: Error) => this.msg.info(err.message));
    });
  }
  ngOnDestroy(): void {
    if (this.table.expandedRow) internalAndExternalEconomicsController.update(this.table.expandedRow);
    this.subscriptions.unsubscribe();
    this.dataSubscriptions.unsubscribe();
    this.save();
  }
  addControllerLink(internalAndExternalEconomics: InternalAndExternalEconomicsTableModel, chip: Chip): void {
    this.$.pause();
    internalAndExternalEconomicsController
      .update(internalAndExternalEconomics)
      .then(() =>
        internalAndExternalEconomicsController
          .createControllerLink({
            projectId: this.navigationService.currentPoint.projectId,
            internalAndExternalEconomicsId: internalAndExternalEconomics.id,
            controllerId: Number(chip.id),
          })
          .catch((err: Error) => this.msg.info(err.message))
      )
      .then(() => this.$.resume())
      .catch((err: Error) => this.msg.info(err.message));
  }

  removeControllerLink(internalAndExternalEconomics: InternalAndExternalEconomicsTableModel, chip: Chip): void {
    this.$.pause();
    internalAndExternalEconomicsController
      .update(internalAndExternalEconomics)
      .then(() =>
        internalAndExternalEconomicsController
          .removeControllerLink({
            controllerId: Number(chip.id),
            internalAndExternalEconomicsId: internalAndExternalEconomics.id,
            projectId: this.navigationService.currentPoint.projectId,
          })
          .catch((err: Error) => this.msg.info(err.message))
      )
      .then(() => this.$.resume())
      .catch((err: Error) => this.msg.info(err.message));
  }

  save(): void {
    internalAndExternalEconomicsController.updateDescription(this.internalAndExternalEconomics);
  }
  columns: ColumnDefinition[] = [
    { label: 'ID', key: 'id', searchable: false },
    { label: 'CAST.INTERNALANDEXTERNAL.NAME', key: 'name', searchable: true },
    { label: 'Description', key: 'description', searchable: true, hidden: true },
  ];

  constructor(
    translate: TranslateService,
    private readonly msg: MessageService,
    private readonly navigationService: AppNavigationService
  ) {
    translate
      .get(['CAST.INTERNALANDEXTERNAL.NAME', 'CAST.INTERNALANDEXTERNAL.TITLE'])
      .pipe(
        tap(res => {
          this.columns = [
            { label: res['CAST.INTERNALANDEXTERNAL.NAME'], key: 'name', searchable: true },
            { label: 'Description', key: 'description', searchable: true, hidden: true },
          ];
        })
      )
      .subscribe();
  }
}
