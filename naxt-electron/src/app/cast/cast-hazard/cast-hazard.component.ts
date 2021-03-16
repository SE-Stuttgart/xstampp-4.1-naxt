import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import {
  hazardController,
  HazardTableModel,
  QuestionAndAnswer,
  questionAndAnswerController,
  QuestionAndAnswerTableModel,
} from '@cast/index';
import { AppNavigationService, KeyValuePair, MessageService } from '@core/index';
import { TranslateService } from '@ngx-translate/core';
import { Chip, ColumnDefinition, ExpandTimings, Subscriptions, TableComponent } from '@shared/index';
import { tap } from 'rxjs/operators';
import { pausable, PausableObservable } from '@shared/utils/PausableObservable';

@Component({
  selector: 'naxt-cast-hazard',
  templateUrl: './cast-hazard.component.html',
  styleUrls: ['./cast-hazard.component.scss'],
})
export class CastHazardComponent implements AfterViewInit, OnDestroy {
  private readonly subscriptions: Subscriptions = new Subscriptions();
  private readonly dataSubscriptions: Subscriptions = new Subscriptions();
  private $: PausableObservable<HazardTableModel[]>;

  textOfTextfield: string = '';
  @ViewChild(TableComponent) table: TableComponent<HazardTableModel>;

  hazardData: HazardTableModel[] = [];
  private shouldCreateNew: boolean = false;
  private shouldFocus: boolean = false;
  private firstLoad: boolean = true;
  listOfLinkedHazard: QuestionAndAnswerTableModel[] = [];

  ngAfterViewInit(): void {
    this.subscriptions.plusOne = this.table.rowExpanded
      .pipe(
        tap(hazard => {
          this.navigationService.setNewKeyValue(new KeyValuePair(hazard.tableId));
          //this.updateQaAList();
        })
      )
      .subscribe();

    this.subscriptions.plusOne = this.table.rowCollapsed
      .pipe(
        tap(hazard => {
          hazardController.update(hazard).catch((err: Error) => this.msg.info(err.message));
          this.navigationService.setNewKeyValue(undefined);
          console.log(hazard);
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
          hazardController.remove(event.row).catch((err: Error) => this.msg.info(err.message));
        })
      )
      .subscribe();
    this.subscriptions.plusOne = this.navigationService.activePoint
      .pipe(
        tap(() => {
          // saves active row on project change
          if (!!this.table?.expandedRow)
            hazardController.update(this.table.expandedRow).catch((err: Error) => this.msg.info(err.message));

          // resubscribse to data of the new project
          this.dataSubscriptions.unsubscribe();
          this.initDataSubscriptions();
        })
      )
      .subscribe();
  }

  initDataSubscriptions(): void {
    this.$ = hazardController.getAll$(this.navigationService.currentPoint.projectId).pipe(
      tap(v => {
        this.hazardData = v;

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
    ) as PausableObservable<HazardTableModel[]>;
    this.dataSubscriptions.plusOne = this.$.subscribe();
  }

  createHazard(): void {
    // checks if a hazard has no name, then don't create another
    if (this.shouldCreateNew || this.hazardData.filter(hazard => !hazard?.name && hazard.name.length <= 0)?.length > 0)
      return;
    if (!!this.table.expandedRow) {
      this.shouldCreateNew = true;
      this.table.collapseRows();
    } else this.backendCreate();
  }

  backendCreate(): void {
    this.shouldFocus = true;
    hazardController.create(this.navigationService.currentPoint.projectId).catch((err: Error) => {
      this.msg.info(err.message);
      this.shouldFocus = false;
    });
  }

  addConstraintLink(hazard: HazardTableModel, chip: Chip): void {
    this.$.pause();
    hazardController
      .update(hazard)
      .then(() =>
        hazardController
          .createConstraintLink({
            projectId: this.navigationService.currentPoint.projectId,
            constraintId: chip.id as string,
            hazardId: hazard.id,
          })
          .catch((err: Error) => this.msg.info(err.message))
      )
      .then(() => this.$.resume())
      .catch((err: Error) => this.msg.info(err.message));
  }

  removeConstraintLink(hazard: HazardTableModel, chip: Chip): void {
    this.$.pause();
    console.error('FIRED???');
    hazardController
      .update(hazard)
      .then(() =>
        hazardController
          .removeConstraintLink({
            hazardId: hazard.id,
            constraintId: chip.id as string,
            projectId: this.navigationService.currentPoint.projectId,
          })
          .catch((err: Error) => this.msg.info(err.message))
      )
      .then(() => this.$.resume())
      .catch((err: Error) => this.msg.info(err.message));
  }

  createHazardQuestionLink(question: string): void {
    const qna: QuestionAndAnswer = {
      ...new QuestionAndAnswer(),
      projectId: this.navigationService.currentPoint.projectId,
      name: question,
    };

    questionAndAnswerController.createQuestionAnswer(qna).then(qnaAnswer => {
      questionAndAnswerController
        .createHazardLink(this.navigationService.currentPoint.projectId, this.table.expandedRow.id, qnaAnswer.id)
        .catch((err: Error) => this.msg.info(err.message));
    });
  }

  ngOnDestroy(): void {
    if (this.table.expandedRow) hazardController.update(this.table.expandedRow);
    this.dataSubscriptions.unsubscribe();
    this.subscriptions.unsubscribe();
  }

  columns: ColumnDefinition[] = [
    { label: 'ID', key: 'id', searchable: false },
    { label: 'CAST.HAZARDS.NAME', key: 'name', searchable: true },
    { label: 'Description', key: 'description', searchable: true, hidden: true },
  ];

  constructor(
    translate: TranslateService,
    private readonly navigationService: AppNavigationService,
    private readonly msg: MessageService
  ) {
    translate
      .get(['CAST.HAZARDS.NAME', 'CAST.HAZARDS.TITLE'])
      .pipe(
        tap(res => {
          this.columns = [
            { label: res['CAST.HAZARDS.NAME'], key: 'name', searchable: true },
            { label: 'Description', key: 'description', searchable: true, hidden: true },
          ];
        })
      )
      .subscribe();
  }
}
