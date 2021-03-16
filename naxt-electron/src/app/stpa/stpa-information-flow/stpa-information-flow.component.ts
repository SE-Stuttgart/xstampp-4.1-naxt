import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { AppNavigationService, KeyValuePair, MessageService } from '@core/index';
import { TranslateService } from '@ngx-translate/core';
import { ColumnDefinition, ExpandTimings, FilterEntry, Subscriptions, TableComponent } from '@shared/index';
import { InformationFlowType } from '@src-shared/Enums';
import { informationFlowController, InformationFlowTableEntry } from '@stpa/index';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'naxt-stpa-information-flow',
  templateUrl: './stpa-information-flow.component.html',
  styleUrls: ['./stpa-information-flow.component.scss'],
})
export class StpaInformationFlowComponent implements AfterViewInit, OnDestroy {
  private readonly subscriptions: Subscriptions = new Subscriptions();
  private readonly dataSubscriptions: Subscriptions = new Subscriptions();
  @ViewChild(TableComponent) table: TableComponent<InformationFlowTableEntry>;
  menuList: FilterEntry[] = [
    { id: 1, name: InformationFlowType.ControlAction },
    { id: 2, name: InformationFlowType.Feedback },
    { id: 3, name: InformationFlowType.Input },
    { id: 4, name: InformationFlowType.Output },
  ];
  informationFlowData: InformationFlowTableEntry[] = [];
  private shouldCreateNew: boolean = false;
  private shouldFocus: boolean = false;
  private firstLoad: boolean = true;

  ngAfterViewInit(): void {
    this.subscriptions.plusOne = this.table.rowExpanded
      .pipe(tap(informationFlow => this.navigationService.setNewKeyValue(new KeyValuePair(informationFlow.tableId))))
      .subscribe();

    this.subscriptions.plusOne = this.table.rowCollapsed
      .pipe(
        tap(informationFlow => {
          if (informationFlow.type === InformationFlowType.Feedback) {
            informationFlowController.updateFeedback(informationFlow).catch((err: Error) => this.msg.info(err.message));
          } else if (informationFlow.type === InformationFlowType.ControlAction) {
            informationFlowController
              .updateControlAction(informationFlow)
              .catch((err: Error) => this.msg.info(err.message));
          } else if (informationFlow.type === InformationFlowType.Input) {
            informationFlowController.updateInput(informationFlow).catch((err: Error) => this.msg.info(err.message));
          } else {
            informationFlowController.updateOutput(informationFlow).catch((err: Error) => this.msg.info(err.message));
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
          if (event.row.type === InformationFlowType.Feedback) {
            informationFlowController.removeFeedback(event.row).catch((err: Error) => this.msg.info(err.message));
          } else if (event.row.type === InformationFlowType.ControlAction) {
            informationFlowController.removeControlAction(event.row).catch((err: Error) => this.msg.info(err.message));
          } else if (event.row.type === InformationFlowType.Input) {
            informationFlowController.removeInput(event.row).catch((err: Error) => this.msg.info(err.message));
          } else {
            informationFlowController.removeOutput(event.row).catch((err: Error) => this.msg.info(err.message));
          }
        })
      )
      .subscribe();

    this.subscriptions.plusOne = this.navigationService.activePoint
      .pipe(
        tap(() => {
          // saves active row on project change
          if (!!this.table?.expandedRow) {
            if (this.table?.expandedRow.type === InformationFlowType.Feedback) {
              informationFlowController
                .updateFeedback(this.table?.expandedRow)
                .catch((err: Error) => this.msg.info(err.message));
            } else if (this.table?.expandedRow.type === InformationFlowType.ControlAction) {
              informationFlowController
                .updateControlAction(this.table?.expandedRow)
                .catch((err: Error) => this.msg.info(err.message));
            } else if (this.table?.expandedRow.type === InformationFlowType.Input) {
              informationFlowController
                .updateInput(this.table?.expandedRow)
                .catch((err: Error) => this.msg.info(err.message));
            } else {
              informationFlowController
                .updateOutput(this.table?.expandedRow)
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
  initDataSubscriptions(): void {
    this.dataSubscriptions.plusOne = informationFlowController
      .getAll$(this.navigationService.currentPoint.projectId)
      .pipe(
        tap(v => {
          this.informationFlowData = v;
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
      if (this.table.expandedRow.type === InformationFlowType.Feedback) {
        informationFlowController
          .updateFeedback(this.table.expandedRow)
          .catch((err: Error) => this.msg.info(err.message));
      } else if (this.table.expandedRow.type === InformationFlowType.ControlAction) {
        informationFlowController
          .updateControlAction(this.table.expandedRow)
          .catch((err: Error) => this.msg.info(err.message));
      } else if (this.table.expandedRow.type === InformationFlowType.Input) {
        informationFlowController.updateInput(this.table.expandedRow).catch((err: Error) => this.msg.info(err.message));
      } else {
        informationFlowController
          .updateOutput(this.table.expandedRow)
          .catch((err: Error) => this.msg.info(err.message));
      }
    }
    this.dataSubscriptions.unsubscribe();
    this.subscriptions.unsubscribe();
  }

  private type: string;
  createInformationFlow(tableEntry: FilterEntry): void {
    this.type = tableEntry.name;
    if (
      this.shouldCreateNew ||
      this.informationFlowData.filter(informationFlow => !informationFlow.name || informationFlow.name.length <= 0)
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
    if (this.type === InformationFlowType.Feedback) {
      informationFlowController.createFeedback(projectId).catch((err: Error) => {
        this.msg.info(err.message);
        this.shouldFocus = false;
      });
    } else if (this.type === InformationFlowType.ControlAction) {
      informationFlowController.createControlAction(projectId).catch((err: Error) => {
        this.msg.info(err.message);
        this.shouldFocus = false;
      });
    } else if (this.type === InformationFlowType.Input) {
      informationFlowController.createInput(projectId).catch((err: Error) => {
        this.msg.info(err.message);
        this.shouldFocus = false;
      });
    } else {
      informationFlowController.createOutput(projectId).catch((err: Error) => {
        this.msg.info(err.message);
        this.shouldFocus = false;
      });
    }
  }

  columns: ColumnDefinition[] = [
    { label: 'ID', key: 'id', searchable: false },
    { label: 'STPA.INFORMATIONFLOW.NAME', key: 'name', searchable: true },
    { label: 'STPA.INFORMATIONFLOW.TYPE', key: 'type', searchable: true },
    { label: 'Description', key: 'description', searchable: true, hidden: true },
  ];
  constructor(
    translate: TranslateService,
    private readonly navigationService: AppNavigationService,
    private readonly msg: MessageService
  ) {
    translate
      .get(['STPA.INFORMATIONFLOW.NAME', 'STPA.INFORMATIONFLOW.TITLE', 'STPA.INFORMATIONFLOW.TYPE'])
      .pipe(
        tap(res => {
          this.columns = [
            { label: res['STPA.INFORMATIONFLOW.NAME'], key: 'name', searchable: true },
            { label: res['STPA.INFORMATIONFLOW.TYPE'], key: 'type', searchable: true },
            { label: 'Description', key: 'description', searchable: true, hidden: true },
          ];
        })
      )
      .subscribe();
  }
}
