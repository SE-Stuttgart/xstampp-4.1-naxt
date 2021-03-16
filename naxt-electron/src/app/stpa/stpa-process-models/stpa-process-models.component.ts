import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { AppNavigationService, KeyValuePair, MessageService } from '@core/index';
import { TranslateService } from '@ngx-translate/core';
import { Chip, ColumnDefinition, ExpandTimings, Subscriptions, TableComponent, UpdateTiming } from '@shared/index';
import { Controller } from '@src-shared/control-structure/models';
import { State } from '@src-shared/Enums';
import { LossTableEntry, processModelController, ProcessModelTableEntry } from '@stpa/index';
import { auditTime, tap } from 'rxjs/operators';
import { pausable, PausableObservable } from '@shared/utils/PausableObservable';

@Component({
  selector: 'naxt-stpa-process-models',
  templateUrl: './stpa-process-models.component.html',
  styleUrls: ['./stpa-process-models.component.scss'],
})
export class StpaProcessModelsComponent implements AfterViewInit, OnDestroy {
  private readonly subscriptions: Subscriptions = new Subscriptions();
  private readonly dataSubscriptions: Subscriptions = new Subscriptions();
  @ViewChild(TableComponent) table: TableComponent<ProcessModelTableEntry>;
  menuList: Controller[] = [];
  processModelData: ProcessModelTableEntry[] = [];
  private shouldCreateNew: boolean = false;
  private shouldFocus: boolean = false;

  ngAfterViewInit(): void {
    this.subscriptions.plusOne = processModelController
      .getRequiredEntries$(this.navigationService.currentPoint.projectId)
      .pipe(
        auditTime(UpdateTiming.REGUALR),
        tap(v => {
          this.menuList = v;
        })
      )
      .subscribe();

    this.subscriptions.plusOne = this.table.rowExpanded
      .pipe(tap(processModel => this.navigationService.setNewKeyValue(new KeyValuePair(processModel.tableId))))
      .subscribe();

    this.subscriptions.plusOne = this.table.rowCollapsed
      .pipe(
        tap(processModel => {
          processModelController.updateProcessModel(processModel).catch((err: Error) => this.msg.info(err.message));
          this.navigationService.setNewKeyValue(undefined);

          if (this.shouldCreateNew) {
            this.shouldCreateNew = false;
            this.backendCreate(this.chosenController);
          }
        })
      )
      .subscribe();

    this.subscriptions.plusOne = this.table.rowDelete
      .pipe(
        tap(event => {
          processModelController.removeProcessModel(event.row).catch((err: Error) => this.msg.info(err.message));
        })
      )
      .subscribe();
    // called if project changes but subcompinent (loss, uc etc.) did not change!
    this.subscriptions.plusOne = this.navigationService.activePoint
      .pipe(
        tap(navPoint => {
          // saves active row on project change
          if (!!this.table?.expandedRow)
            processModelController
              .updateProcessModel(this.table.expandedRow)
              .catch((err: Error) => this.msg.info(err.message));

          // resubscribse to data of the new project
          this.dataSubscriptions.unsubscribe();
          this.initDataSubscriptions();

          // opens selecten row if needed
          if (this.table?.expandedRow?.tableId !== navPoint.keyValuePair?.value)
            setTimeout(() => {
              this.table.activateRowByPair(navPoint.keyValuePair);
            }, ExpandTimings.REGULAR);
        })
      )
      .subscribe();
  }

  $: PausableObservable<ProcessModelTableEntry[]>;
  initDataSubscriptions(): void {
    this.$ = processModelController.getAll$(this.navigationService.currentPoint.projectId).pipe(
      tap(v => {
        this.processModelData = v;
        if (this.shouldFocus) {
          this.shouldFocus = false;
          setTimeout(() => this.table.activateRowByPair({ key: 'name', value: '' }), ExpandTimings.REGULAR);
        }
      }),
      pausable()
    ) as PausableObservable<ProcessModelTableEntry[]>;
    this.dataSubscriptions.plusOne = this.$.subscribe();
  }

  ngOnDestroy(): void {
    if (this.table.expandedRow)
      processModelController
        .updateProcessModel(this.table.expandedRow)
        .catch((err: Error) => this.msg.info(err.message));
    this.dataSubscriptions.unsubscribe();
    this.subscriptions.unsubscribe();
  }

  chosenController: Controller;

  createProcessModel(event): void {
    this.chosenController = event;
    if (
      this.shouldCreateNew ||
      this.processModelData.filter(subRecommendation => !subRecommendation?.name && subRecommendation.name.length <= 0)
        ?.length > 0
    )
      return;
    if (!!this.table.expandedRow) {
      this.shouldCreateNew = true;
      this.table.collapseRows();
    } else this.backendCreate(this.chosenController);
  }

  addControllerLink(loss: LossTableEntry, chip: Chip): void {
    this.$.pause();
    processModelController.updateProcessModel({ ...loss, controllerId: Number(chip.id) }).then(() => this.$.resume());
  }

  removeControllerLink(loss: LossTableEntry): void {
    this.$.pause();
    processModelController.updateProcessModel({ ...loss, controllerId: -1 }).then(() => this.$.resume());
  }

  backendCreate(chosenController: Controller): void {
    this.shouldFocus = true;
    processModelController
      .createProcessModel({
        id: -1,
        projectId: this.navigationService.currentPoint.projectId,
        name: '',
        description: '',
        controllerId: chosenController.id,
        state: State.TODO,
      })
      .catch((err: Error) => {
        this.msg.info(err.message);
        this.shouldFocus = false;
      });
  }

  columns: ColumnDefinition[] = [
    { label: 'ID', key: 'id', searchable: false },
    { label: 'STPA.PROCESSMODELS.NAME', key: 'name', searchable: true },
    { label: 'Description', key: 'description', searchable: true, hidden: true },
  ];

  constructor(
    translate: TranslateService,
    private readonly navigationService: AppNavigationService,
    private readonly msg: MessageService
  ) {
    translate
      .get(['STPA.PROCESSMODELS.NAME', 'STPA.PROCESSMODELS.TITLE'])
      .pipe(
        tap(res => {
          this.columns = [
            { label: res['STPA.PROCESSMODELS.NAME'], key: 'name', searchable: true },
            { label: 'Description', key: 'description', searchable: true, hidden: true },
          ];
        })
      )
      .subscribe();
  }
}
