import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { AppNavigationService, KeyValuePair, MessageService } from '@core/index';
import { TranslateService } from '@ngx-translate/core';
import { Chip, ColumnDefinition, ExpandTimings, Subscriptions, TableComponent } from '@shared/index';
import { lossController, LossTableEntry } from '@stpa/index';
import { tap } from 'rxjs/operators';
import { State } from 'shared/Enums';
import { pausable, PausableObservable } from '@shared/utils/PausableObservable';

@Component({
  selector: 'naxt-stpa-losses',
  templateUrl: './stpa-losses.component.html',
  styleUrls: ['./stpa-losses.component.scss'],
})
export class StpaLossesComponent implements AfterViewInit, OnDestroy {
  private readonly subscriptions: Subscriptions = new Subscriptions();
  private readonly dataSubscriptions: Subscriptions = new Subscriptions();
  @ViewChild(TableComponent) table: TableComponent<LossTableEntry>;

  lossData: LossTableEntry[] = [];
  private shouldCreateNew: boolean = false;
  private shouldFocus: boolean = false;
  private firstLoad: boolean = true;

  columns: ColumnDefinition[] = [
    { label: 'ID', key: 'id', searchable: false },
    { label: 'Name', key: 'name', searchable: true },
    { label: 'Description', key: 'description', searchable: true },
  ];

  ngAfterViewInit(): void {
    this.subscriptions.plusOne = this.table.rowExpanded
      .pipe(tap(loss => this.navigationService.setNewKeyValue(new KeyValuePair(loss.tableId))))
      .subscribe();

    this.subscriptions.plusOne = this.table.rowCollapsed
      .pipe(
        tap(loss => {
          lossController.updateLoss(loss).catch((err: Error) => this.msg.info(err.message));
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
          lossController.removeLoss(event.row).catch((err: Error) => this.msg.info(err.message));
        })
      )
      .subscribe();

    // called if project changes but subcompinent (loss, uc etc.) did not change!
    this.subscriptions.plusOne = this.navigationService.activePoint
      .pipe(
        tap(() => {
          // saves active row on project change
          if (!!this.table?.expandedRow)
            lossController.updateLoss(this.table.expandedRow).catch((err: Error) => this.msg.info(err.message));

          // resubscribse to data of the new project
          this.dataSubscriptions.unsubscribe();
          this.initDataSubscriptions();
        })
      )
      .subscribe();
  }

  $: PausableObservable<LossTableEntry[]>;
  initDataSubscriptions(): void {
    this.$ = lossController.getAll$(this.navigationService.currentPoint.projectId).pipe(
      tap(v => {
        this.lossData = v;

        if (this.firstLoad) {
          this.firstLoad = false;

          // opens selecten row if needed
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
    ) as PausableObservable<LossTableEntry[]>;
    this.dataSubscriptions.plusOne = this.$.subscribe();
  }

  ngOnDestroy(): void {
    if (this.table.expandedRow)
      lossController.updateLoss(this.table.expandedRow).catch((err: Error) => this.msg.info(err.message));
    this.dataSubscriptions.unsubscribe();
    this.subscriptions.unsubscribe();
  }

  createLoss(): void {
    // checks if a loss has no name, then don#t create another
    if (this.shouldCreateNew || this.lossData.filter(loss => !loss.name || loss.name.length <= 0).length > 0) return;

    if (!!this.table.expandedRow) {
      this.shouldCreateNew = true;
      this.table.collapseRows();
    } else this.backendCreate();
  }

  backendCreate(): void {
    this.shouldFocus = true;
    lossController
      .createLoss({
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

  addHazardlink(loss: LossTableEntry, chip: Chip): void {
    this.$.pause();
    lossController
      .updateLoss(loss)
      .then(() =>
        lossController
          .createHazardLink({
            hazardId: Number(chip.id),
            lossId: loss.id,
            projectId: this.navigationService.currentPoint.projectId,
          })
          .catch((err: Error) => this.msg.info(err.message))
      )
      .then(() => this.$.resume())
      .catch((err: Error) => this.msg.info(err.message));
  }

  removeHazardLink(loss: LossTableEntry, chip: Chip): void {
    this.$.pause();
    lossController
      .updateLoss(loss)
      .then(() =>
        lossController
          .removeHazardLink({
            hazardId: Number(chip.id),
            lossId: loss.id,
            projectId: this.navigationService.currentPoint.projectId,
          })
          .catch((err: Error) => this.msg.info(err.message))
      )
      .then(() => this.$.resume())
      .catch((err: Error) => this.msg.info(err.message));
  }

  constructor(
    translate: TranslateService,
    private readonly navigationService: AppNavigationService,
    private readonly msg: MessageService
  ) {
    translate
      .get(['STPA.LOSSES.NAME', 'STPA.LOSSES.TITLE'])
      .pipe(
        tap(res => {
          this.columns = [
            { label: res['STPA.LOSSES.NAME'], key: 'name', searchable: true },
            { label: 'Description', key: 'description', searchable: true, hidden: true },
          ];
        })
      )
      .subscribe();
  }
}
