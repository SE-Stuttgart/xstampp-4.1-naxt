import { AfterViewInit, Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { Chip, ColumnDefinition, ExpandTimings, Subscriptions, TableComponent } from '@shared/index';
import {
  communicationAndCoordinationController,
  CommunicationAndCoordinationDescription,
  CommunicationAndCoordinationTableModel,
  QuestionAndAnswer,
  questionAndAnswerController,
} from '@cast/index';
import { AppNavigationService, KeyValuePair, MessageService } from '@core/index';
import { tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { pausable, PausableObservable } from '@shared/utils/PausableObservable';

@Component({
  selector: 'naxt-cast-communication-and-coordination',
  templateUrl: './cast-communication-and-coordination.component.html',
  styleUrls: ['./cast-communication-and-coordination.component.scss'],
})
export class CastCommunicationAndCoordinationComponent implements AfterViewInit, OnDestroy {
  @Input() safetyCultureManagmentId: number = 1;
  private readonly subscriptions: Subscriptions = new Subscriptions();
  private readonly dataSubscriptions: Subscriptions = new Subscriptions();
  textOfTextfield: string = '';
  @ViewChild(TableComponent) table: TableComponent<CommunicationAndCoordinationTableModel>;
  communicationAndCoordination: CommunicationAndCoordinationDescription;

  communicationAndCoordinationData: CommunicationAndCoordinationTableModel[] = [];
  private shouldCreateNew: boolean = false;
  private shouldFocus: boolean = false;
  private firstLoad: boolean = true;

  ngAfterViewInit(): void {
    this.subscriptions.plusOne = this.table.rowExpanded
      .pipe(
        tap(communicationAndCoordination => {
          this.navigationService.setNewKeyValue(new KeyValuePair(communicationAndCoordination.tableId));
        })
      )
      .subscribe();

    this.subscriptions.plusOne = this.table.rowCollapsed
      .pipe(
        tap(communicationAndCoordination => {
          communicationAndCoordinationController
            .update(communicationAndCoordination)
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
        tap(communicationAndCoordination => {
          communicationAndCoordinationController
            .remove(communicationAndCoordination.row)
            .catch((err: Error) => this.msg.info(err.message));
        })
      )
      .subscribe();

    this.subscriptions.plusOne = this.navigationService.activePoint
      .pipe(
        tap(() => {
          // saves active row on project change
          if (!!this.table?.expandedRow)
            communicationAndCoordinationController
              .update(this.table.expandedRow)
              .catch((err: Error) => this.msg.info(err.message));

          // resubscribse to data of the new project
          this.dataSubscriptions.unsubscribe();
          this.initDataSubscriptions();
        })
      )
      .subscribe();
  }

  $: PausableObservable<CommunicationAndCoordinationTableModel[]>;
  initDataSubscriptions(): void {
    this.dataSubscriptions.plusOne = communicationAndCoordinationController
      .getDescription$(this.navigationService.currentPoint.projectId)
      .pipe(
        tap(v => {
          this.communicationAndCoordination = v;
        })
      )
      .subscribe();

    this.$ = communicationAndCoordinationController.getAll$(this.navigationService.currentPoint.projectId).pipe(
      tap(v => {
        this.communicationAndCoordinationData = v;

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
    ) as PausableObservable<CommunicationAndCoordinationTableModel[]>;
    this.dataSubscriptions.plusOne = this.$.subscribe();
  }

  createCommunicationAndCoordination(): void {
    // checks if a hazard has no name, then don't create another
    if (
      this.shouldCreateNew ||
      this.communicationAndCoordinationData.filter(
        communicationAndCoordination =>
          !communicationAndCoordination?.name && communicationAndCoordination.name.length <= 0
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
    communicationAndCoordinationController.create(this.navigationService.currentPoint.projectId).catch((err: Error) => {
      this.msg.info(err.message);
      this.shouldFocus = false;
    });
  }
  createCACQuestionLink(question: string): void {
    const qna: QuestionAndAnswer = {
      ...new QuestionAndAnswer(),
      projectId: this.navigationService.currentPoint.projectId,
      name: question,
    };

    questionAndAnswerController.createQuestionAnswer(qna).then(qnaAnswer => {
      questionAndAnswerController
        .createCommunicationAndCoordinationLink(
          this.navigationService.currentPoint.projectId,
          this.table.expandedRow.id,
          qnaAnswer.id
        )
        .catch((err: Error) => this.msg.info(err.message));
    });
  }
  ngOnDestroy(): void {
    if (this.table.expandedRow) communicationAndCoordinationController.update(this.table.expandedRow);
    this.subscriptions.unsubscribe();
    this.dataSubscriptions.unsubscribe();
    this.save();
  }

  addController1Link(communicationAndCoordination: CommunicationAndCoordinationTableModel, chip: Chip): void {
    this.$.pause();
    communicationAndCoordinationController
      .update(communicationAndCoordination)
      .then(() =>
        communicationAndCoordinationController
          .createController1Link({
            projectId: this.navigationService.currentPoint.projectId,
            communicationAndCoordinationId: communicationAndCoordination.id,
            controllerId: Number(chip.id),
          })
          .catch((err: Error) => this.msg.info(err.message))
      )
      .then(() => this.$.resume())
      .catch((err: Error) => this.msg.info(err.message));
  }

  removeController1Link(communicationAndCoordination: CommunicationAndCoordinationTableModel, chip: Chip): void {
    this.$.pause();
    communicationAndCoordinationController
      .update(communicationAndCoordination)
      .then(() =>
        communicationAndCoordinationController
          .removeController1Link({
            controllerId: Number(chip.id),
            communicationAndCoordinationId: communicationAndCoordination.id,
            projectId: this.navigationService.currentPoint.projectId,
          })
          .catch((err: Error) => this.msg.info(err.message))
      )
      .then(() => this.$.resume())
      .catch((err: Error) => this.msg.info(err.message));
  }

  addController2Link(communicationAndCoordination: CommunicationAndCoordinationTableModel, chip: Chip): void {
    this.$.pause();
    communicationAndCoordinationController
      .update(communicationAndCoordination)
      .then(() =>
        communicationAndCoordinationController
          .createController2Link({
            projectId: this.navigationService.currentPoint.projectId,
            communicationAndCoordinationId: communicationAndCoordination.id,
            controllerId: Number(chip.id),
          })
          .catch((err: Error) => this.msg.info(err.message))
      )
      .then(() => this.$.resume())
      .catch((err: Error) => this.msg.info(err.message));
  }

  removeController2Link(communicationAndCoordination: CommunicationAndCoordinationTableModel, chip: Chip): void {
    this.$.pause();
    communicationAndCoordinationController
      .update(communicationAndCoordination)
      .then(() =>
        communicationAndCoordinationController
          .removeController2Link({
            controllerId: Number(chip.id),
            communicationAndCoordinationId: communicationAndCoordination.id,
            projectId: this.navigationService.currentPoint.projectId,
          })
          .catch((err: Error) => this.msg.info(err.message))
      )
      .then(() => this.$.resume())
      .catch((err: Error) => this.msg.info(err.message));
  }

  save(): void {
    communicationAndCoordinationController.updateDescription(this.communicationAndCoordination);
  }
  columns: ColumnDefinition[] = [
    { label: 'ID', key: 'id', searchable: false },
    { label: 'CAST.COMMUNICATIONCOORDINATION.NAME', key: 'name', searchable: true },
    { label: 'Description', key: 'description', searchable: true, hidden: true },
  ];

  constructor(
    translate: TranslateService,
    private readonly msg: MessageService,
    private readonly navigationService: AppNavigationService
  ) {
    translate
      .get(['CAST.COMMUNICATIONCOORDINATION.NAME', 'CAST.COMMUNICATIONCOORDINATION.TITLE'])
      .pipe(
        tap(res => {
          this.columns = [
            { label: res['CAST.COMMUNICATIONCOORDINATION.NAME'], key: 'name', searchable: true },
            { label: 'Description', key: 'description', searchable: true, hidden: true },
          ];
        })
      )
      .subscribe();
  }
}
