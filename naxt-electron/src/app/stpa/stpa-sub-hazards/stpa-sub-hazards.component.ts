import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { AppNavigationService, KeyValuePair, MessageService } from '@core/index';
import { TranslateService } from '@ngx-translate/core';
import { ColumnDefinition, ExpandTimings, Subscriptions, TableComponent } from '@shared/index';
import { State } from '@src-shared/Enums';
import { Hazard, subHazardController, SubHazardTableEntry } from '@stpa/index';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'naxt-stpa-sub-hazards',
  templateUrl: './stpa-sub-hazards.component.html',
  styleUrls: ['./stpa-sub-hazards.component.scss'],
})
export class StpaSubHazardsComponent implements AfterViewInit, OnDestroy {
  private readonly subscriptions: Subscriptions = new Subscriptions();
  private readonly dataSubscriptions: Subscriptions = new Subscriptions();
  @ViewChild(TableComponent) table: TableComponent<SubHazardTableEntry>;
  menuList: Hazard[] = [];
  subHazardData: SubHazardTableEntry[] = [];
  private shouldCreateNew: boolean = false;
  private shouldFocus: boolean = false;
  private firstLoad: boolean = true;

  columns: ColumnDefinition[] = [
    { label: 'ID', key: 'id', searchable: false },
    { label: 'STPA.SUBHAZARDS.NAME', key: 'name', searchable: true },
    { label: 'Description', key: 'description', searchable: true, hidden: true },
  ];

  ngAfterViewInit(): void {
    this.subscriptions.plusOne = subHazardController
      .getPossibleParents$(this.navigationService.currentPoint.projectId)
      .pipe(
        tap(hazard => {
          this.menuList = hazard;
        })
      )
      .subscribe();

    this.subscriptions.plusOne = this.table.rowExpanded
      .pipe(tap(subHazard => this.navigationService.setNewKeyValue(new KeyValuePair(subHazard.tableId))))
      .subscribe();

    this.subscriptions.plusOne = this.table.rowCollapsed
      .pipe(
        tap(subHazard => {
          subHazardController.updateSubHazard(subHazard);
          this.navigationService.setNewKeyValue(undefined);

          if (this.shouldCreateNew) {
            this.shouldCreateNew = false;
            this.backendCreate(this.chosenHazard);
          }
        })
      )
      .subscribe();

    this.subscriptions.plusOne = this.table.rowDelete
      .pipe(
        tap(event => {
          subHazardController.removeSubHazard(event.row);
        })
      )
      .subscribe();

    // called if project changes but subcompinent (loss, uc etc.) did not change!
    this.subscriptions.plusOne = this.navigationService.activePoint
      .pipe(
        tap(() => {
          // saves active row on project change
          if (!!this.table?.expandedRow)
            subHazardController
              .updateSubHazard(this.table.expandedRow)
              .catch((err: Error) => this.msg.info(err.message));

          // resubscribse to data of the new project
          this.dataSubscriptions.unsubscribe();
          this.initDataSubscriptions();
        })
      )
      .subscribe();
  }

  initDataSubscriptions(): void {
    this.dataSubscriptions.plusOne = subHazardController
      .getAll$(this.navigationService.currentPoint.projectId)
      .pipe(
        tap(v => {
          this.subHazardData = v;
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
    if (this.table.expandedRow)
      subHazardController.updateSubHazard(this.table.expandedRow).catch((err: Error) => this.msg.info(err.message));
    this.dataSubscriptions.unsubscribe();
    this.subscriptions.unsubscribe();
  }

  chosenHazard: Hazard;

  createSubHazard(event): void {
    this.chosenHazard = event;
    // checks if a loss has no name, then don#t create another
    if (this.shouldCreateNew || this.subHazardData.filter(loss => !loss.name || loss.name.length <= 0).length > 0)
      return;

    if (!!this.table.expandedRow) {
      this.shouldCreateNew = true;
      this.table.collapseRows();
    } else this.backendCreate(this.chosenHazard);
  }

  backendCreate(chosenHazard: Hazard): void {
    this.shouldFocus = true;
    subHazardController
      .createSubHazard({
        id: -1,
        name: '',
        description: '',
        projectId: this.navigationService.currentPoint.projectId,
        parentId: chosenHazard.id,
        state: State.TODO,
      })
      .catch((err: Error) => {
        this.msg.info(err.message);
        this.shouldFocus = false;
      });
  }

  constructor(
    translate: TranslateService,
    private readonly navigationService: AppNavigationService,
    private readonly msg: MessageService
  ) {
    translate
      .get(['STPA.SUBHAZARDS.NAME', 'STPA.SUBHAZARDS.TITLE'])
      .pipe(
        tap(res => {
          this.columns = [
            { label: res['STPA.SUBHAZARDS.NAME'], key: 'name', searchable: true },
            { label: 'Description', key: 'description', searchable: true, hidden: true },
          ];
        })
      )
      .subscribe();
  }
}
