import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { AppNavigationService, KeyValuePair, MessageService } from '@core/index';
import { TranslateService } from '@ngx-translate/core';
import { Chip, ColumnDefinition, ExpandTimings, Subscriptions, TableComponent, UpdateTiming } from '@shared/index';
import { auditTime, tap } from 'rxjs/operators';
import { controlAlgorithmController, ControlAlgorithmTableEntry } from '@stpa/index';
import { Controller } from '@src-shared/control-structure/models';
import { State } from '@src-shared/Enums';
import { pausable, PausableObservable } from '@shared/utils/PausableObservable';

@Component({
  selector: 'naxt-stpa-control-algorithms',
  templateUrl: './stpa-control-algorithms.component.html',
  styleUrls: ['./stpa-control-algorithms.component.scss'],
})
export class StpaControlAlgorithmsComponent implements AfterViewInit, OnDestroy {
  private readonly subscriptions: Subscriptions = new Subscriptions();
  private readonly dataSubscriptions: Subscriptions = new Subscriptions();
  @ViewChild(TableComponent) table: TableComponent<ControlAlgorithmTableEntry>;
  menuList: Controller[] = [];
  controlAlgorithmData: ControlAlgorithmTableEntry[] = [];
  private shouldCreateNew: boolean = false;
  private shouldFocus: boolean = false;
  private firstLoad: boolean = true;

  ngAfterViewInit(): void {
    this.subscriptions.plusOne = controlAlgorithmController
      .getRequiredEntries$(this.navigationService.currentPoint.projectId)
      .pipe(
        auditTime(UpdateTiming.REGUALR),
        tap(v => {
          this.menuList = v;
        })
      )
      .subscribe();

    this.subscriptions.plusOne = this.table.rowExpanded
      .pipe(
        tap(controlAlgorithm => {
          this.navigationService.setNewKeyValue(new KeyValuePair(controlAlgorithm.tableId));
          // console.log(controlAlgorithm);
        })
      )
      .subscribe();

    this.subscriptions.plusOne = this.table.rowCollapsed
      .pipe(
        tap(controlAlgorithm => {
          controlAlgorithmController.updateRule(controlAlgorithm).catch((err: Error) => this.msg.info(err.message));
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
          controlAlgorithmController.removeRule(event.row).catch((err: Error) => this.msg.info(err.message));
        })
      )
      .subscribe();
    // called if project changes but subcompinent (loss, uc etc.) did not change!
    this.subscriptions.plusOne = this.navigationService.activePoint
      .pipe(
        tap(() => {
          // saves active row on project change
          if (!!this.table?.expandedRow)
            controlAlgorithmController
              .updateRule(this.table.expandedRow)
              .catch((err: Error) => this.msg.info(err.message));

          // resubscribse to data of the new project
          this.dataSubscriptions.unsubscribe();
          this.initDataSubscriptions();
        })
      )
      .subscribe();
  }

  $: PausableObservable<ControlAlgorithmTableEntry[]>;
  initDataSubscriptions(): void {
    this.$ = controlAlgorithmController.getAll$(this.navigationService.currentPoint.projectId).pipe(
      tap(v => {
        this.controlAlgorithmData = v;
        if (this.firstLoad) {
          this.firstLoad = false;
          // opens selected row if needed
          if (this.table?.expandedRow?.tableId !== this.navigationService.currentPoint.keyValuePair?.value)
            setTimeout(() => {
              this.table.activateRowByPair(this.navigationService.currentPoint.keyValuePair);
            }, ExpandTimings.REGULAR);
        }
        if (this.shouldFocus) {
          this.shouldFocus = false;
          setTimeout(() => this.table.activateRowByPair({ key: 'rule', value: '' }), ExpandTimings.REGULAR);
        }
      }),
      pausable()
    ) as PausableObservable<ControlAlgorithmTableEntry[]>;

    this.dataSubscriptions.plusOne = this.$.subscribe();
  }

  ngOnDestroy(): void {
    if (this.table.expandedRow)
      controlAlgorithmController.updateRule(this.table.expandedRow).catch((err: Error) => this.msg.info(err.message));
    this.dataSubscriptions.unsubscribe();
    this.subscriptions.unsubscribe();
  }
  chosenController: Controller;

  createControlAlgorithm(event): void {
    this.chosenController = event;
    if (
      this.shouldCreateNew ||
      this.controlAlgorithmData.filter(
        subRecommendation => !subRecommendation?.rule && subRecommendation.rule.length <= 0
      )?.length > 0
    )
      return;
    if (!!this.table.expandedRow) {
      this.shouldCreateNew = true;
      this.table.collapseRows();
    } else this.backendCreate(this.chosenController);
  }
  backendCreate(chosenController: Controller): void {
    this.shouldFocus = true;
    controlAlgorithmController
      .createRule({
        id: -1,
        projectId: this.navigationService.currentPoint.projectId,
        name: '',
        controlActionId: -1,
        controllerId: chosenController.id,
        description: '',
        parentId: chosenController.id,
        rule: '',
        state: State.TODO,
      })
      .catch((err: Error) => {
        this.msg.info(err.message);
        this.shouldFocus = false;
      });
  }
  addControlActionLink(controlAlgorithm: ControlAlgorithmTableEntry, chip: Chip): void {
    this.$.pause();
    controlAlgorithmController
      .updateRule({
        ...controlAlgorithm,
        controlActionId: Number(chip.id),
      })
      .then(controlAlgorithm => {
        this.$.resume();
        this.table.expandedRow.controlActionId = controlAlgorithm.controlActionId;
      });
  }

  removeControlActionLink(controlAlgorithm: ControlAlgorithmTableEntry): void {
    this.$.pause();
    controlAlgorithmController.updateRule({ ...controlAlgorithm, controlActionId: -1 }).then(controlAlgorithm => {
      this.$.resume();
      this.table.expandedRow.controlActionId = controlAlgorithm.controlActionId;
    });
  }

  columns: ColumnDefinition[] = [];
  constructor(
    translate: TranslateService,
    private readonly navigationService: AppNavigationService,
    private readonly msg: MessageService
  ) {
    translate
      .get(['STPA.CONTROLALGORITHMS.DROPDOWNTITLENAME', 'STPA.CONTROLALGORITHMS.TITLE', 'STPA.CONTROLALGORITHMS.RULE'])
      .pipe(
        tap(res => {
          this.columns = [
            // { label: res['STPA.CONTROLALGORITHMS.DROPDOWNTITLENAME'], key: 'controlAlgorithm', searchable: true },
            { label: res['STPA.CONTROLALGORITHMS.DROPDOWNTITLENAME'], key: 'controllerName', searchable: true },
            { label: res['STPA.CONTROLALGORITHMS.RULE'], key: 'rule', searchable: true },
          ];
        })
      )
      .subscribe();
  }
}
