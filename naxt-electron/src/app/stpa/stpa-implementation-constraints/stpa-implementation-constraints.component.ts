import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { AppNavigationService, KeyValuePair, MessageService } from '@core/index';
import { TranslateService } from '@ngx-translate/core';
import { ColumnDefinition, ExpandTimings, NestedEmit, Subscriptions, TableComponent } from '@shared/index';
import { State } from '@src-shared/Enums';
import { implementationConstraintController, ImplementationConstraintTableEntry, RequiredModels } from '@stpa/index';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'naxt-stpa-implementation-constraints',
  templateUrl: './stpa-implementation-constraints.component.html',
  styleUrls: ['./stpa-implementation-constraints.component.scss'],
})
export class StpaImplementationConstraintsComponent implements AfterViewInit, OnDestroy {
  private readonly subscriptions: Subscriptions = new Subscriptions();
  private readonly dataSubscriptions: Subscriptions = new Subscriptions();
  @ViewChild(TableComponent) table: TableComponent<ImplementationConstraintTableEntry>;

  menuMapImplementationConstraint: RequiredModels = { nestedModels: [] };
  implementationConstraintData: ImplementationConstraintTableEntry[] = [];
  private shouldCreateNew: boolean = false;
  private shouldFocus: boolean = false;

  ngAfterViewInit(): void {
    implementationConstraintController
      .getRequiredEntries$(this.navigationService.currentPoint.projectId)
      .pipe(
        tap(systemConstraint => {
          this.menuMapImplementationConstraint = systemConstraint;
        })
      )
      .subscribe();
    this.subscriptions.plusOne = this.table.rowExpanded
      .pipe(
        tap(implementationConstraint =>
          this.navigationService.setNewKeyValue(new KeyValuePair(implementationConstraint.tableId))
        )
      )
      .subscribe();

    this.subscriptions.plusOne = this.table.rowCollapsed
      .pipe(
        tap(implementationConstraint => {
          implementationConstraintController
            .update(implementationConstraint)
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
        tap(event => {
          implementationConstraintController.remove(event.row).catch((err: Error) => this.msg.info(err.message));
        })
      )
      .subscribe();

    // called if project changes but subcompinent (implementation, uc etc.) did not change!
    this.subscriptions.plusOne = this.navigationService.activePoint
      .pipe(
        tap(navPoint => {
          // saves active row on project change
          if (!!this.table?.expandedRow)
            implementationConstraintController
              .update(this.table.expandedRow)
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

  initDataSubscriptions(): void {
    this.dataSubscriptions.plusOne = implementationConstraintController
      .getAll$(this.navigationService.currentPoint.projectId)
      .pipe(
        tap(v => {
          this.implementationConstraintData = v;
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
      implementationConstraintController
        .update(this.table.expandedRow)
        .catch((err: Error) => this.msg.info(err.message));
    this.dataSubscriptions.unsubscribe();
    this.subscriptions.unsubscribe();
  }

  backendCreate(): void {
    this.shouldFocus = true;
    implementationConstraintController
      .create({
        id: -1,
        description: '',
        name: '',
        state: State.TODO,
        projectId: this.navigationService.currentPoint.projectId,
        lossScenarioId: this.chosenMenuEntries.sub.id,
      })
      .catch((err: Error) => {
        this.msg.info(err.message);
        this.shouldFocus = false;
      });
  }
  chosenMenuEntries: NestedEmit;
  createImplementationConstraint(event: NestedEmit): void {
    this.chosenMenuEntries = event;
    if (
      this.shouldCreateNew ||
      this.implementationConstraintData.filter(
        implementation => !implementation.name || implementation.name.length <= 0
      ).length > 0
    )
      return;

    if (!!this.table.expandedRow) {
      this.shouldCreateNew = true;
      this.table.collapseRows();
    } else this.backendCreate();
  }
  columns: ColumnDefinition[] = [
    { label: 'ID', key: 'id', searchable: false },
    { label: 'STPA.IMPEMENTATIONCONSTRAINTS.NAME', key: 'name', searchable: true },
    { label: 'Description', key: 'description', searchable: true, hidden: true },
  ];
  constructor(
    translate: TranslateService,
    private readonly navigationService: AppNavigationService,
    private readonly msg: MessageService
  ) {
    translate
      .get(['STPA.IMPEMENTATIONCONSTRAINTS.NAME', 'STPA.IMPEMENTATIONCONSTRAINTS.TITLE'])
      .pipe(
        tap(res => {
          this.columns = [
            { label: res['STPA.IMPEMENTATIONCONSTRAINTS.NAME'], key: 'name', searchable: true },
            { label: 'Description', key: 'description', searchable: true, hidden: true },
          ];
        })
      )
      .subscribe();
  }
}
