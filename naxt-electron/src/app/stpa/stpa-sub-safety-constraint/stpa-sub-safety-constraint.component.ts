import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { AppNavigationService, KeyValuePair, MessageService } from '@core/index';
import { TranslateService } from '@ngx-translate/core';
import { ColumnDefinition, ExpandTimings, NestedEmit, Subscriptions, TableComponent } from '@shared/index';
import { State } from '@src-shared/Enums';
import { RequiredModels, subSystemConstraintController, SubSystemConstraintTableEntry } from '@stpa/index';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'naxt-stpa-sub-safety-constraint',
  templateUrl: './stpa-sub-safety-constraint.component.html',
  styleUrls: ['./stpa-sub-safety-constraint.component.scss'],
})
export class StpaSubSafetyConstraintComponent implements AfterViewInit, OnDestroy {
  private readonly subscriptions: Subscriptions = new Subscriptions();
  private readonly dataSubscriptions: Subscriptions = new Subscriptions();
  @ViewChild(TableComponent) table: TableComponent<SubSystemConstraintTableEntry>;

  menuMapSubSystemConstraint: RequiredModels = { nestedModels: [] };
  subSystemConstraintData: SubSystemConstraintTableEntry[] = [];
  private shouldCreateNew: boolean = false;
  private shouldFocus: boolean = false;
  private firstLoad: boolean = true;

  ngAfterViewInit(): void {
    subSystemConstraintController
      .getRequiredEntries$(this.navigationService.currentPoint.projectId)
      .pipe(
        tap(systemConstraint => {
          this.menuMapSubSystemConstraint = systemConstraint;
        })
      )
      .subscribe();
    this.subscriptions.plusOne = this.table.rowExpanded
      .pipe(
        tap(subSystemConstraint => this.navigationService.setNewKeyValue(new KeyValuePair(subSystemConstraint.tableId)))
      )
      .subscribe();

    this.subscriptions.plusOne = this.table.rowCollapsed
      .pipe(
        tap(subSystemConstraint => {
          subSystemConstraintController
            .updateSubSystemConstraint(subSystemConstraint)
            .catch((err: Error) => this.msg.info(err.message));
          this.navigationService.setNewKeyValue(undefined);

          if (this.shouldCreateNew) {
            this.shouldCreateNew = false;
            this.backendCreate(this.chosenMenuEntries);
          }
        })
      )
      .subscribe();

    this.subscriptions.plusOne = this.table.rowDelete
      .pipe(
        tap(event => {
          subSystemConstraintController
            .removeSubSystemConstraint(event.row)
            .catch((err: Error) => this.msg.info(err.message));
        })
      )
      .subscribe();

    // called if project changes but subcompinent (loss, uc etc.) did not change!
    this.subscriptions.plusOne = this.navigationService.activePoint
      .pipe(
        tap(() => {
          // saves active row on project change
          if (!!this.table?.expandedRow)
            subSystemConstraintController
              .updateSubSystemConstraint(this.table.expandedRow)
              .catch((err: Error) => this.msg.info(err.message));

          // resubscribse to data of the new project
          this.dataSubscriptions.unsubscribe();
          this.initDataSubscriptions();
        })
      )
      .subscribe();
  }

  initDataSubscriptions(): void {
    this.dataSubscriptions.plusOne = subSystemConstraintController
      .getAll$(this.navigationService.currentPoint.projectId)
      .pipe(
        tap(v => {
          this.subSystemConstraintData = v;
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
      subSystemConstraintController
        .updateSubSystemConstraint(this.table.expandedRow)
        .catch((err: Error) => this.msg.info(err.message));
    this.dataSubscriptions.unsubscribe();
    this.subscriptions.unsubscribe();
  }

  backendCreate(chosenMenuEntry: NestedEmit): void {
    this.shouldFocus = true;
    subSystemConstraintController
      .createSubSystemConstraint({
        id: -1,
        description: '',
        hazardId: chosenMenuEntry.sub.parentId,
        parentId: chosenMenuEntry.main.id,
        name: '',
        state: State.TODO,
        projectId: this.navigationService.currentPoint.projectId,
        subHazardId: chosenMenuEntry.sub.id,
      })
      .catch((err: Error) => {
        this.msg.info(err.message);
        this.shouldFocus = false;
      });
  }
  chosenMenuEntries: NestedEmit;
  createSubSafetyConstraint(event: NestedEmit): void {
    this.chosenMenuEntries = event;
    if (
      this.shouldCreateNew ||
      this.subSystemConstraintData.filter(loss => !loss.name || loss.name.length <= 0).length > 0
    )
      return;

    if (!!this.table.expandedRow) {
      this.shouldCreateNew = true;
      this.table.collapseRows();
    } else this.backendCreate(this.chosenMenuEntries);
  }

  columns: ColumnDefinition[] = [
    { label: 'ID', key: 'id', searchable: false },
    { label: 'STPA.SUBSAFETYCONSTRAINTS.NAME', key: 'name', searchable: true },
    { label: 'Description', key: 'description', searchable: true, hidden: true },
  ];

  constructor(
    translate: TranslateService,
    private readonly navigationService: AppNavigationService,
    private readonly msg: MessageService
  ) {
    translate
      .get(['STPA.SUBSAFETYCONSTRAINTS.NAME', 'STPA.SUBSAFETYCONSTRAINTS.TITLE'])
      .pipe(
        tap(res => {
          this.columns = [
            { label: res['STPA.SUBSAFETYCONSTRAINTS.NAME'], key: 'name', searchable: true },
            { label: 'Description', key: 'description', searchable: true, hidden: true },
          ];
        })
      )
      .subscribe();
  }
}
