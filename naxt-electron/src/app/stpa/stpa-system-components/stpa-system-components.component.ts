import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { AppNavigationService, KeyValuePair, MessageService } from '@core/index';
import { TranslateService } from '@ngx-translate/core';
import { ColumnDefinition, ExpandTimings, FilterEntry, Subscriptions, TableComponent } from '@shared/index';
import { SystemComponentType } from '@src-shared/Enums';
import { systemComponentController, SystemComponentTableEntry } from '@stpa/index';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'naxt-stpa-system-components',
  templateUrl: './stpa-system-components.component.html',
  styleUrls: ['./stpa-system-components.component.scss'],
})
export class StpaSystemComponentsComponent implements AfterViewInit, OnDestroy {
  private readonly subscriptions: Subscriptions = new Subscriptions();
  private readonly dataSubscriptions: Subscriptions = new Subscriptions();
  @ViewChild(TableComponent) table: TableComponent<SystemComponentTableEntry>;
  menuList: FilterEntry[] = [
    { id: 1, name: SystemComponentType.Controller },
    { id: 2, name: SystemComponentType.Actuator },
    { id: 3, name: SystemComponentType.Sensor },
    { id: 4, name: SystemComponentType.ControlledProcess },
  ];

  systemComponentData: SystemComponentTableEntry[] = [];
  private shouldCreateNew: boolean = false;
  private shouldFocus: boolean = false;
  private firstLoad: boolean = true;

  ngAfterViewInit(): void {
    this.subscriptions.plusOne = this.table.rowExpanded
      .pipe(tap(systemComponent => this.navigationService.setNewKeyValue(new KeyValuePair(systemComponent.tableId))))
      .subscribe();

    this.subscriptions.plusOne = this.table.rowCollapsed
      .pipe(
        tap(systemComponent => {
          if (systemComponent.type === SystemComponentType.Controller) {
            systemComponentController
              .updateController(systemComponent)
              .catch((err: Error) => this.msg.info(err.message));
          } else if (systemComponent.type === SystemComponentType.Actuator) {
            systemComponentController.updateActuator(systemComponent).catch((err: Error) => this.msg.info(err.message));
          } else if (systemComponent.type === SystemComponentType.Sensor) {
            systemComponentController.updateSensor(systemComponent).catch((err: Error) => this.msg.info(err.message));
          } else {
            systemComponentController
              .updateControlledProcess(systemComponent)
              .catch((err: Error) => this.msg.info(err.message));
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
          if (event.row.type === SystemComponentType.Controller) {
            systemComponentController.removeController(event.row).catch((err: Error) => this.msg.info(err.message));
          } else if (event.row.type === SystemComponentType.Actuator) {
            systemComponentController.removeActuator(event.row).catch((err: Error) => this.msg.info(err.message));
          } else if (event.row.type === SystemComponentType.Sensor) {
            systemComponentController.removeSensor(event.row).catch((err: Error) => this.msg.info(err.message));
          } else {
            systemComponentController
              .removeControlledProcess(event.row)
              .catch((err: Error) => this.msg.info(err.message));
          }
        })
      )
      .subscribe();

    // called if project changes but subcompinent (loss, uc etc.) did not change!
    this.subscriptions.plusOne = this.navigationService.activePoint
      .pipe(
        tap(() => {
          // saves active row on project change
          if (!!this.table?.expandedRow)
            if (this.table?.expandedRow.type === SystemComponentType.Controller) {
              systemComponentController
                .updateController(this.table?.expandedRow)
                .catch((err: Error) => this.msg.info(err.message));
            } else if (this.table?.expandedRow.type === SystemComponentType.Actuator) {
              systemComponentController
                .updateActuator(this.table?.expandedRow)
                .catch((err: Error) => this.msg.info(err.message));
            } else if (this.table?.expandedRow.type === SystemComponentType.Sensor) {
              systemComponentController
                .updateSensor(this.table?.expandedRow)
                .catch((err: Error) => this.msg.info(err.message));
            } else {
              systemComponentController
                .updateControlledProcess(this.table?.expandedRow)
                .catch((err: Error) => this.msg.info(err.message));
            }

          // resubscribse to data of the new project
          this.dataSubscriptions.unsubscribe();
          this.initDataSubscriptions();
        })
      )
      .subscribe();
  }

  initDataSubscriptions(): void {
    this.dataSubscriptions.plusOne = systemComponentController
      .getAll$(this.navigationService.currentPoint.projectId)
      .pipe(
        tap(v => {
          this.systemComponentData = v;
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
            setTimeout(() => this.table.activateRowByPair({ key: 'name', value: '' }), ExpandTimings.REGULAR);
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    if (this.table.expandedRow) {
      if (this.table.expandedRow.type === SystemComponentType.Controller) {
        systemComponentController
          .updateController(this.table.expandedRow)
          .catch((err: Error) => this.msg.info(err.message));
      } else if (this.table.expandedRow.type === SystemComponentType.Actuator) {
        systemComponentController
          .updateActuator(this.table.expandedRow)
          .catch((err: Error) => this.msg.info(err.message));
      } else if (this.table.expandedRow.type === SystemComponentType.Sensor) {
        systemComponentController
          .updateSensor(this.table.expandedRow)
          .catch((err: Error) => this.msg.info(err.message));
      } else {
        systemComponentController
          .updateControlledProcess(this.table.expandedRow)
          .catch((err: Error) => this.msg.info(err.message));
      }
    }
    this.dataSubscriptions.unsubscribe();
    this.subscriptions.unsubscribe();
  }
  private type: string;
  createSystemComponent(tableEntry: FilterEntry): void {
    this.type = tableEntry.name;
    if (
      this.shouldCreateNew ||
      this.systemComponentData.filter(systemComponent => !systemComponent.name || systemComponent.name.length <= 0)
        .length > 0
    ) {
      return;
    }

    if (!!this.table.expandedRow) {
      this.shouldCreateNew = true;
      this.table.collapseRows();
    } else this.backendCreate();
  }

  backendCreate(): void {
    this.shouldFocus = true;
    const projectId = this.navigationService.currentPoint.projectId;
    if (this.type === SystemComponentType.Controller) {
      systemComponentController.createController(projectId).catch((err: Error) => {
        this.msg.info(err.message);
        this.shouldFocus = false;
      });
    } else if (this.type === SystemComponentType.Actuator) {
      systemComponentController.createActuator(projectId).catch((err: Error) => {
        this.msg.info(err.message);
        this.shouldFocus = false;
      });
    } else if (this.type === SystemComponentType.Sensor) {
      systemComponentController.createSensor(projectId).catch((err: Error) => {
        this.msg.info(err.message);
        this.shouldFocus = false;
      });
    } else {
      systemComponentController.createControlledProcess(projectId).catch((err: Error) => {
        this.msg.info(err.message);
        this.shouldFocus = false;
      });
    }
  }
  columns: ColumnDefinition[] = [
    { label: 'ID', key: 'id', searchable: false },
    { label: 'STPA.SYSTEMCOMPONENTS.NAME', key: 'name', searchable: true },
    { label: 'STPA.SYSTEMCOMPONENTS.TYPE', key: 'type', searchable: true },
    { label: 'Description', key: 'description', searchable: true, hidden: true },
  ];
  constructor(
    translate: TranslateService,
    private readonly navigationService: AppNavigationService,
    private readonly msg: MessageService
  ) {
    translate
      .get(['STPA.SYSTEMCOMPONENTS.NAME', 'STPA.SYSTEMCOMPONENTS.TITLE', 'STPA.SYSTEMCOMPONENTS.TYPE'])
      .pipe(
        tap(res => {
          this.columns = [
            { label: res['STPA.SYSTEMCOMPONENTS.NAME'], key: 'name', searchable: true },
            { label: res['STPA.SYSTEMCOMPONENTS.TYPE'], key: 'type', searchable: true },
            { label: 'Description', key: 'description', searchable: true, hidden: true },
          ];
        })
      )
      .subscribe();
  }
}
