import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { AppNavigationService, KeyValuePair, MessageService } from '@core/index';
import { TranslateService } from '@ngx-translate/core';
import {
  Chip,
  ColumnDefinition,
  ExpandTimings,
  NestedEmit,
  Subscriptions,
  TableComponent,
  UpdateTiming,
} from '@shared/index';
import { auditTime, tap } from 'rxjs/operators';
import { conversionController, ConversionTableEntry, ConversionType, RequiredModels } from '@stpa/index';
import { pausable, PausableObservable } from '@shared/utils/PausableObservable';

@Component({
  selector: 'naxt-stpa-conversions',
  templateUrl: './stpa-conversions.component.html',
  styleUrls: ['./stpa-conversions.component.scss'],
})
export class StpaConversionsComponent implements AfterViewInit, OnDestroy {
  private readonly subscriptions: Subscriptions = new Subscriptions();
  private readonly dataSubscriptions: Subscriptions = new Subscriptions();
  @ViewChild(TableComponent) table: TableComponent<ConversionTableEntry>;
  menuMapConversion: RequiredModels = { nestedModels: [] };
  conversionData: ConversionTableEntry[] = [];
  private shouldCreateNew: boolean = false;
  private shouldFocus: boolean = false;
  private firstLoad: boolean = true;

  ngAfterViewInit(): void {
    this.subscriptions.plusOne = conversionController
      .getRequiredEntries$(this.navigationService.currentPoint.projectId)
      .pipe(
        auditTime(UpdateTiming.REGUALR),
        tap(v => {
          this.menuMapConversion = v;
        })
      )
      .subscribe();

    this.subscriptions.plusOne = this.table.rowExpanded
      .pipe(
        tap(conversion => {
          this.navigationService.setNewKeyValue(new KeyValuePair(conversion.tableId));
        })
      )
      .subscribe();

    this.subscriptions.plusOne = this.table.rowCollapsed
      .pipe(
        tap(conversion => {
          if (conversion.type === ConversionType.Actuator) {
            conversionController.updateActuatorConversion(conversion).catch((err: Error) => this.msg.info(err.message));
          } else {
            conversionController.updateSensorConversion(conversion).catch((err: Error) => this.msg.info(err.message));
          }
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
        tap(event => {
          if (event.row.type === ConversionType.Actuator) {
            conversionController.removeActuatorConversion(event.row).catch((err: Error) => this.msg.info(err.message));
          } else {
            conversionController.removeSensorConversion(event.row).catch((err: Error) => this.msg.info(err.message));
          }
        })
      )
      .subscribe();
    // called if project changes but subcompinent (loss, uc etc.) did not change!
    this.subscriptions.plusOne = this.navigationService.activePoint
      .pipe(
        tap(() => {
          // saves active row on project change
          if (!!this.table?.expandedRow) {
            if (this.table.expandedRow.type === ConversionType.Actuator) {
              conversionController
                .updateActuatorConversion(this.table.expandedRow)
                .catch((err: Error) => this.msg.info(err.message));
            } else {
              conversionController
                .updateSensorConversion(this.table.expandedRow)
                .catch((err: Error) => this.msg.info(err.message));
            }
          }

          // resubscribse to data of the new project
          this.dataSubscriptions.unsubscribe();
          this.initDataSubscriptions();
        })
      )
      .subscribe();
  }
  $: PausableObservable<ConversionTableEntry[]>;
  initDataSubscriptions(): void {
    this.$ = conversionController.getAll$(this.navigationService.currentPoint.projectId).pipe(
      tap(v => {
        this.conversionData = v;
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
          setTimeout(() => this.table.activateRowByPair({ key: 'conversion', value: '' }), ExpandTimings.REGULAR);
        }
      }),
      pausable()
    ) as PausableObservable<ConversionTableEntry[]>;
    this.dataSubscriptions.plusOne = this.$.subscribe();
  }

  ngOnDestroy(): void {
    if (this.table.expandedRow) {
      if (this.table?.expandedRow.type === ConversionType.Actuator) {
        conversionController
          .updateActuatorConversion(this.table.expandedRow)
          .catch((err: Error) => this.msg.info(err.message));
      } else {
        conversionController
          .updateSensorConversion(this.table.expandedRow)
          .catch((err: Error) => this.msg.info(err.message));
      }
    }
    this.dataSubscriptions.unsubscribe();
    this.subscriptions.unsubscribe();
  }

  chosenMenuEntries: NestedEmit;
  createConversion(event: NestedEmit): void {
    this.chosenMenuEntries = event;
    if (
      this.shouldCreateNew ||
      this.conversionData.filter(conversion => !conversion?.conversion && conversion.conversion.length <= 0)?.length > 0
    )
      return;
    if (!!this.table.expandedRow) {
      this.shouldCreateNew = true;
      this.table.collapseRows();
    } else this.backendCreate();
  }
  backendCreate(): void {
    this.shouldFocus = true;
    if (this.chosenMenuEntries.sub.modelLabel === ConversionType.Actuator) {
      conversionController
        .createActuatorConversion(this.navigationService.currentPoint.projectId, this.chosenMenuEntries.sub.id)
        .catch((err: Error) => this.msg.info(err.message));
    } else {
      conversionController
        .createSensorConversion(this.navigationService.currentPoint.projectId, this.chosenMenuEntries.sub.id)
        .catch((err: Error) => this.msg.info(err.message));
    }
  }
  addControlActionLink(conversion: ConversionTableEntry, chip: Chip): void {
    this.$.pause();
    if (this.table.expandedRow.type === ConversionType.Actuator) {
      conversionController
        .updateActuatorConversion({
          ...conversion,
          controlActionId: Number(chip.id),
        })
        .then(conversion => {
          this.$.resume();
          this.table.expandedRow.controlActionId = conversion.controlActionId;
        });
    } else {
      conversionController
        .updateSensorConversion({
          ...conversion,
          controlActionId: Number(chip.id),
        })
        .then(conversion => {
          this.$.resume();
          this.table.expandedRow.controlActionId = conversion.controlActionId;
        });
    }
  }

  removeControlActionLink(conversion: ConversionTableEntry): void {
    this.$.pause();
    if (this.table.expandedRow.type === ConversionType.Actuator) {
      conversionController
        .updateActuatorConversion({
          ...conversion,
          controlActionId: -1,
        })
        .then(conversion => {
          this.$.resume();
          this.table.expandedRow.controlActionId = conversion.controlActionId;
        });
    } else {
      conversionController
        .updateSensorConversion({
          ...conversion,
          controlActionId: -1,
        })
        .then(conversion => {
          this.$.resume();
          this.table.expandedRow.controlActionId = conversion.controlActionId;
        });
    }
  }
  columns: ColumnDefinition[] = [];
  constructor(
    translate: TranslateService,
    private readonly navigationService: AppNavigationService,
    private readonly msg: MessageService
  ) {
    translate
      .get(['STPA.CONVERSIONS.DROPDOWNTITLENAME', 'STPA.CONVERSIONS.TITLE', 'STPA.CONVERSIONS.RULE'])
      .pipe(
        tap(res => {
          this.columns = [
            { label: res['STPA.CONVERSIONS.DROPDOWNTITLENAME'], key: 'parentComponentName', searchable: true },
            { label: res['STPA.CONVERSIONS.RULE'], key: 'conversion', searchable: true },
          ];
        })
      )
      .subscribe();
  }
}
