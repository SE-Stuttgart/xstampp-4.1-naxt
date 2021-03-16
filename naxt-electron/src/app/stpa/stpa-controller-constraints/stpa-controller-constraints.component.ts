import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { AppNavigationService, KeyValuePair, MessageService } from '@core/index';
import { TranslateService } from '@ngx-translate/core';
import { ColumnDefinition, ExpandTimings, Subscriptions, TableComponent } from '@shared/index';
import { controllerConstraintController, ControllerConstraintTableEntry } from '@stpa/index';
import { tap } from 'rxjs/operators';
import { pausable, PausableObservable } from '@shared/utils/PausableObservable';

@Component({
  selector: 'naxt-stpa-controller-constraints',
  templateUrl: './stpa-controller-constraints.component.html',
  styleUrls: ['./stpa-controller-constraints.component.scss'],
})
export class StpaControllerConstraintsComponent implements AfterViewInit, OnDestroy {
  private readonly subscriptions: Subscriptions = new Subscriptions();
  private readonly dataSubscriptions: Subscriptions = new Subscriptions();
  @ViewChild(TableComponent) table: TableComponent<ControllerConstraintTableEntry>;

  controllerConstraintData: ControllerConstraintTableEntry[] = [];
  private shouldFocus: boolean = false;
  private firstLoad: boolean = true;

  ngAfterViewInit(): void {
    this.subscriptions.plusOne = this.table.rowExpanded
      .pipe(
        tap(controllerConstraint =>
          this.navigationService.setNewKeyValue(new KeyValuePair(controllerConstraint.tableId))
        )
      )
      .subscribe();

    this.subscriptions.plusOne = this.table.rowCollapsed
      .pipe(
        tap(controllerConstraint => {
          controllerConstraintController
            .updateControllerConstraint(controllerConstraint)
            .catch((err: Error) => this.msg.info(err.message));
          this.navigationService.setNewKeyValue(undefined);
        })
      )
      .subscribe();

    // called if project changes but subcompinent (loss, uc etc.) did not change!
    this.subscriptions.plusOne = this.navigationService.activePoint
      .pipe(
        tap(() => {
          // saves active row on project change
          if (!!this.table?.expandedRow)
            controllerConstraintController
              .updateControllerConstraint(this.table.expandedRow)
              .catch((err: Error) => this.msg.info(err.message));

          // resubscribse to data of the new project
          this.dataSubscriptions.unsubscribe();
          this.initDataSubscriptions();
        })
      )
      .subscribe();
  }

  $: PausableObservable<ControllerConstraintTableEntry[]>;
  initDataSubscriptions(): void {
    this.$ = controllerConstraintController.getAll$(this.navigationService.currentPoint.projectId).pipe(
      tap(v => {
        this.controllerConstraintData = v;

        // opens selecten row if needed
        if (this.firstLoad) {
          this.firstLoad = false;
          if (this.table?.expandedRow?.tableId !== this.navigationService.currentPoint.keyValuePair?.value) {
            this.firstLoad = false;
            setTimeout(() => {
              this.table.activateRowByPair(this.navigationService.currentPoint.keyValuePair);
            }, ExpandTimings.REGULAR);
          }
        }
        if (this.shouldFocus) {
          this.shouldFocus = false;
          setTimeout(() => this.table.activateRowByPair({ key: 'name', value: '' }), ExpandTimings.REGULAR);
        }
      }),
      pausable()
    ) as PausableObservable<ControllerConstraintTableEntry[]>;
    this.dataSubscriptions.plusOne = this.$.subscribe();
  }
  ngOnDestroy(): void {
    if (this.table.expandedRow)
      controllerConstraintController
        .updateControllerConstraint(this.table.expandedRow)
        .catch((err: Error) => this.msg.info(err.message));
    this.dataSubscriptions.unsubscribe();
    this.subscriptions.unsubscribe();
  }

  columns: ColumnDefinition[] = [
    { label: 'STPA.CONTROLLERCONSTRAINTS.NAME', key: 'name', searchable: true },
    { label: 'STPA.CONTROLLERCONSTRAINTS.UCANAME', key: 'ucaName', searchable: true },
    { label: 'Description', key: 'description', searchable: true, hidden: true },
  ];
  constructor(
    translate: TranslateService,
    private readonly navigationService: AppNavigationService,
    private readonly msg: MessageService
  ) {
    translate
      .get([
        'STPA.CONTROLLERCONSTRAINTS.NAME',
        'STPA.CONTROLLERCONSTRAINTS.TITLE',
        'STPA.CONTROLLERCONSTRAINTS.UCANAME',
      ])
      .pipe(
        tap(res => {
          this.columns = [
            { label: res['STPA.CONTROLLERCONSTRAINTS.NAME'], key: 'name', searchable: true },
            { label: res['STPA.CONTROLLERCONSTRAINTS.UCANAME'], key: 'nameUca', searchable: true },
            { label: 'Description', key: 'description', searchable: true, hidden: true },
          ];
        })
      )
      .subscribe();
  }
}
