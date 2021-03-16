import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { AppNavigationService, KeyValuePair, MessageService } from '@core/index';
import { TranslateService } from '@ngx-translate/core';
import { Chip, ColumnDefinition, ExpandTimings, Subscriptions, TableComponent } from '@shared/index';
import { tap } from 'rxjs/operators';
import { SystemConstraintTableEntry } from '@stpa/src/main/services/models/table-models/step-1/SystemConstraintTableEntry';
import { systemConstraintController } from '@stpa/index';
import { State } from '@src-shared/Enums';
import { pausable, PausableObservable } from '@shared/utils/PausableObservable';

@Component({
  selector: 'naxt-stpa-system-level-safety-constraints',
  templateUrl: './stpa-system-level-safety-constraints.component.html',
  styleUrls: ['./stpa-system-level-safety-constraints.component.scss'],
})
export class StpaSystemLevelSafetyConstraintsComponent implements AfterViewInit, OnDestroy {
  private readonly subscriptions: Subscriptions = new Subscriptions();
  private readonly dataSubscriptions: Subscriptions = new Subscriptions();
  @ViewChild(TableComponent) table: TableComponent<SystemConstraintTableEntry>;

  systemConstraintData: SystemConstraintTableEntry[] = [];
  private shouldCreateNew: boolean = false;
  private shouldFocus: boolean = false;
  private firstLoad: boolean = true;

  columns: ColumnDefinition[] = [
    { label: 'ID', key: 'id', searchable: false },
    { label: 'STPA.SYSTEMLEVELSAFETYCONSTRAINTS.NAME', key: 'name', searchable: true },
    { label: 'Description', key: 'description', searchable: true },
  ];

  ngAfterViewInit(): void {
    this.subscriptions.plusOne = this.table.rowExpanded
      .pipe(tap(systemConstraint => this.navigationService.setNewKeyValue(new KeyValuePair(systemConstraint.tableId))))
      .subscribe();

    this.subscriptions.plusOne = this.table.rowCollapsed
      .pipe(
        tap(systemConstraint => {
          systemConstraintController
            .updateSystemConstraint(systemConstraint)
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
          systemConstraintController
            .removeSystemConstraint(event.row)
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
            systemConstraintController
              .updateSystemConstraint(this.table.expandedRow)
              .catch((err: Error) => this.msg.info(err.message));

          // resubscribse to data of the new project
          this.dataSubscriptions.unsubscribe();
          this.initDataSubscriptions();
        })
      )
      .subscribe();
  }

  $: PausableObservable<SystemConstraintTableEntry[]>;
  initDataSubscriptions(): void {
    this.$ = systemConstraintController.getAll$(this.navigationService.currentPoint.projectId).pipe(
      tap(v => {
        this.systemConstraintData = v;
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
      }),
      pausable()
    ) as PausableObservable<SystemConstraintTableEntry[]>;
    this.dataSubscriptions.plusOne = this.$.subscribe();
  }
  createSystemConstraint(): void {
    // checks if a loss has no name, then don#t create another
    if (
      this.shouldCreateNew ||
      this.systemConstraintData.filter(systemConstraint => !systemConstraint.name || systemConstraint.name.length <= 0)
        .length > 0
    )
      return;

    if (!!this.table.expandedRow) {
      this.shouldCreateNew = true;
      this.table.collapseRows();
    } else this.backendCreate();
  }

  backendCreate(): void {
    this.shouldFocus = true;
    systemConstraintController
      .createSystemConstraint({
        description: '',
        id: -1,
        name: '',
        projectId: this.navigationService.currentPoint.projectId,
        state: State.TODO,
      })
      .catch((err: Error) => {
        this.msg.info(err.message);
        this.shouldFocus = false;
      });
  }

  addHazardlink(systemConstraint: SystemConstraintTableEntry, chip: Chip): void {
    this.$.pause();
    systemConstraintController.updateSystemConstraint(systemConstraint).then(() => {
      systemConstraintController
        .createHazardLink({
          hazardId: Number(chip.id),
          systemConstraintId: systemConstraint.id,
          projectId: this.navigationService.currentPoint.projectId,
        })
        .then(() => this.$.resume())
        .catch((err: Error) => this.msg.info(err.message));
    });
  }

  removeHazardLink(systemConstraint: SystemConstraintTableEntry, chip: Chip): void {
    this.$.pause();
    systemConstraintController.updateSystemConstraint(systemConstraint).then(() => {
      systemConstraintController
        .removeHazardLink({
          hazardId: Number(chip.id),
          systemConstraintId: systemConstraint.id,
          projectId: this.navigationService.currentPoint.projectId,
        })
        .then(() => this.$.resume())
        .catch((err: Error) => this.msg.info(err.message));
    });
  }

  ngOnDestroy(): void {
    if (this.table.expandedRow) systemConstraintController.updateSystemConstraint(this.table.expandedRow);
    this.dataSubscriptions.unsubscribe();
    this.subscriptions.unsubscribe();
  }

  constructor(
    translate: TranslateService,
    private readonly navigationService: AppNavigationService,
    private readonly msg: MessageService
  ) {
    translate
      .get(['STPA.SYSTEMLEVELSAFETYCONSTRAINTS.NAME', 'STPA.SYSTEMLEVELSAFETYCONSTRAINTS.TITLE'])
      .pipe(
        tap(res => {
          this.columns = [
            { label: res['STPA.SYSTEMLEVELSAFETYCONSTRAINTS.NAME'], key: 'name', searchable: true },
            { label: 'Description', key: 'description', searchable: true, hidden: true },
          ];
        })
      )
      .subscribe();
  }
}
