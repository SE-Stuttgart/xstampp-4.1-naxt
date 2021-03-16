import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import {
  QuestionAndAnswer,
  questionAndAnswerController,
  responsibilityController,
  ResponsibilityTableModel,
} from '@cast/index';
import { AppNavigationService, KeyValuePair, MessageService } from '@core/index';
import { TranslateService } from '@ngx-translate/core';
import { Chip, ColumnDefinition, ExpandTimings, Subscriptions, TableComponent } from '@shared/index';
import { tap } from 'rxjs/operators';
import { pausable, PausableObservable } from '@shared/utils/PausableObservable';

@Component({
  selector: 'naxt-cast-responsibilities',
  templateUrl: './cast-responsibilities.component.html',
  styleUrls: ['./cast-responsibilities.component.scss'],
})
export class CastResponsibilitiesComponent implements AfterViewInit, OnDestroy {
  private readonly subscriptions: Subscriptions = new Subscriptions();
  private readonly dataSubscriptions: Subscriptions = new Subscriptions();
  textOfTextfield: string = '';
  @ViewChild(TableComponent) table: TableComponent<ResponsibilityTableModel>;
  //@Input() responsibilityId: number = 1;

  responsibilityData: ResponsibilityTableModel[] = [];
  private shouldCreateNew: boolean = false;
  private shouldFocus: boolean = false;
  private firstLoad: boolean = true;

  ngAfterViewInit(): void {
    this.subscriptions.plusOne = this.table.rowExpanded
      .pipe(
        tap(responsibility => {
          this.navigationService.setNewKeyValue(new KeyValuePair(responsibility.tableId));
        })
      )
      .subscribe();

    this.subscriptions.plusOne = this.table.rowCollapsed
      .pipe(
        tap(responsibility => {
          responsibilityController.update(responsibility).catch((err: Error) => this.msg.info(err.message));
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
        tap(responsibility => {
          responsibilityController.remove(responsibility.row).catch((err: Error) => this.msg.info(err.message));
        })
      )
      .subscribe();
    this.subscriptions.plusOne = this.navigationService.activePoint
      .pipe(
        tap(() => {
          // saves active row on project change
          if (!!this.table?.expandedRow)
            responsibilityController.update(this.table.expandedRow).catch((err: Error) => this.msg.info(err.message));

          // resubscribse to data of the new project
          this.dataSubscriptions.unsubscribe();
          this.initDataSubscriptions();
        })
      )
      .subscribe();
  }

  $: PausableObservable<ResponsibilityTableModel[]>;
  initDataSubscriptions(): void {
    this.$ = responsibilityController.getAll$(this.navigationService.currentPoint.projectId).pipe(
      tap(v => {
        this.responsibilityData = v;

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
    ) as PausableObservable<ResponsibilityTableModel[]>;
    this.dataSubscriptions.plusOne = this.$.subscribe();
  }
  createResponsibility(): void {
    // checks if a hazard has no name, then don't create another
    if (
      this.shouldCreateNew ||
      this.responsibilityData.filter(responsibility => !responsibility?.name && responsibility.name.length <= 0)
        ?.length > 0
    )
      return;
    if (!!this.table.expandedRow) {
      this.shouldCreateNew = true;
      this.table.collapseRows();
    } else this.backendCreate();
  }

  backendCreate(): void {
    this.shouldFocus = true;
    responsibilityController.create(this.navigationService.currentPoint.projectId).catch((err: Error) => {
      this.msg.info(err.message);
      this.shouldFocus = false;
    });
  }
  createResponsibilityQuestionLink(question: string): void {
    const qna: QuestionAndAnswer = {
      ...new QuestionAndAnswer(),
      projectId: this.navigationService.currentPoint.projectId,
      name: question,
    };

    questionAndAnswerController.createQuestionAnswer(qna).then(qnaAnswer => {
      questionAndAnswerController
        .createResponsibilityLink(
          this.navigationService.currentPoint.projectId,
          this.table.expandedRow.id,
          qnaAnswer.id
        )
        .catch((err: Error) => this.msg.info(err.message));
    });
  }
  ngOnDestroy(): void {
    if (this.table.expandedRow) responsibilityController.update(this.table.expandedRow);
    this.dataSubscriptions.unsubscribe();
    this.subscriptions.unsubscribe();
  }

  addConstraintLink(responsibility: ResponsibilityTableModel, chip: Chip): void {
    this.$.pause();
    responsibilityController
      .update(responsibility)
      .then(() =>
        responsibilityController
          .createConstraintLink({
            projectId: this.navigationService.currentPoint.projectId,
            responsibilityId: responsibility.id,
            constraintId: chip.id as string,
          })
          .catch((err: Error) => this.msg.info(err.message))
      )
      .then(() => this.$.resume())
      .catch((err: Error) => this.msg.info(err.message));
  }

  removeConstraintLink(responsibility: ResponsibilityTableModel, chip: Chip): void {
    this.$.pause();
    responsibilityController
      .update(responsibility)
      .then(() =>
        responsibilityController
          .removeConstraintLink({
            responsibilityId: responsibility.id,
            constraintId: chip.id as string,
            projectId: this.navigationService.currentPoint.projectId,
          })
          .catch((err: Error) => this.msg.info(err.message))
      )
      .then(() => this.$.resume())
      .catch((err: Error) => this.msg.info(err.message));
  }

  addControllerLink(responsibility: ResponsibilityTableModel, chip: Chip): void {
    this.$.pause();
    responsibilityController
      .update(responsibility)
      .then(() =>
        responsibilityController
          .createControllerLink({
            projectId: this.navigationService.currentPoint.projectId,
            responsibilityId: responsibility.id,
            controllerId: Number(chip.id),
          })
          .catch((err: Error) => this.msg.info(err.message))
      )
      .then(() => this.$.resume())
      .catch((err: Error) => this.msg.info(err.message));
  }

  removeControllerLink(responsibility: ResponsibilityTableModel, chip: Chip): void {
    this.$.pause();
    responsibilityController
      .update(responsibility)
      .then(() =>
        responsibilityController
          .removeControllerLink({
            responsibilityId: responsibility.id,
            controllerId: Number(chip.id),
            projectId: this.navigationService.currentPoint.projectId,
          })
          .catch((err: Error) => this.msg.info(err.message))
      )
      .then(() => this.$.resume())
      .catch((err: Error) => this.msg.info(err.message));
  }
  columns: ColumnDefinition[] = [
    { label: 'ID', key: 'id', searchable: false },
    { label: 'CAST.RESPONSIBILITIES.NAME', key: 'name', searchable: true },
    { label: 'Description', key: 'description', searchable: true, hidden: true },
  ];

  constructor(
    translate: TranslateService,
    private readonly navigationService: AppNavigationService,
    private readonly msg: MessageService
  ) {
    translate
      .get(['CAST.RESPONSIBILITIES.NAME', 'CAST.RESPONSIBILITIES.TITLE'])
      .pipe(
        tap(res => {
          this.columns = [
            { label: res['CAST.RESPONSIBILITIES.NAME'], key: 'name', searchable: true },
            { label: 'Description', key: 'description', searchable: true, hidden: true },
          ];
        })
      )
      .subscribe();
  }
}
