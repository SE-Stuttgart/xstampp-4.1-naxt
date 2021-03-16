import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { AppNavigationService, KeyValuePair, MessageService } from '@core/index';
import { TranslateService } from '@ngx-translate/core';
import { Chip, ColumnDefinition, ExpandTimings, Subscriptions, TableComponent } from '@shared/index';
import { hazardController } from '@stpa/index';
import { HazardTableEntry } from '@stpa/src/main/services/models/table-models/step-1/HazardTableEntry';
import { tap } from 'rxjs/operators';
import { State } from 'shared/Enums';
import { Chip as STPAChip } from '@stpa/src/main/services/models/table-models/Chip';
import { pausable, PausableObservable } from '@shared/utils/PausableObservable';

@Component({
  selector: 'naxt-stpa-system-level-hazards',
  templateUrl: './stpa-system-level-hazards.component.html',
  styleUrls: ['./stpa-system-level-hazards.component.scss'],
})
export class StpaSystemLevelHazardsComponent implements AfterViewInit, OnDestroy {
  private readonly subscriptions: Subscriptions = new Subscriptions();
  private readonly dataSubscriptions: Subscriptions = new Subscriptions();
  @ViewChild(TableComponent) table: TableComponent<HazardTableEntry>;

  hazardData: HazardTableEntry[] = [];
  shouldCreateNew: boolean = false;
  shouldFocus: boolean = false;
  private firstLoad: boolean = true;

  columns: ColumnDefinition[] = [
    { label: 'ID', key: 'id', searchable: false },
    { label: 'STPA.SYSTEMLEVELHAZARDS.NAME', key: 'name', searchable: true },
    { label: 'Description', key: 'description', searchable: true, hidden: true },
  ];

  ngAfterViewInit(): void {
    this.subscriptions.plusOne = this.table.rowExpanded
      .pipe(tap(hazard => this.navigationService.setNewKeyValue(new KeyValuePair(hazard.tableId))))
      .subscribe();

    this.subscriptions.plusOne = this.table.rowCollapsed
      .pipe(
        tap(hazard => {
          hazardController.updateHazard(hazard).catch((err: Error) => this.msg.info(err.message));
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
          hazardController.removeHazard(event.row).catch((err: Error) => this.msg.info(err.message));
        })
      )
      .subscribe();
    this.subscriptions.plusOne = this.navigationService.activePoint
      .pipe(
        tap(() => {
          // saves active row on project change
          if (!!this.table?.expandedRow)
            hazardController.updateHazard(this.table.expandedRow).catch((err: Error) => this.msg.info(err.message));

          // resubscribse to data of the new project
          this.dataSubscriptions.unsubscribe();
          this.initDataSubscriptions();
        })
      )
      .subscribe();
  }

  $: PausableObservable<HazardTableEntry[]>;
  initDataSubscriptions(): void {
    this.$ = hazardController.getAll$(this.navigationService.currentPoint.projectId).pipe(
      tap(v => {
        this.hazardData = v;
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
    ) as PausableObservable<HazardTableEntry[]>;
    this.dataSubscriptions.plusOne = this.$.subscribe();
  }

  createHazard(): void {
    // checks if a hazard has no name, then don't create another
    if (this.hazardData.filter(hazard => !hazard?.name && hazard.name.length <= 0)?.length > 0) return;
    if (!!this.table.expandedRow) {
      this.table.collapseRows();
      this.shouldCreateNew = true;
    } else this.backendCreate();
  }

  backendCreate(): void {
    this.shouldFocus = true;
    hazardController
      .createHazard({
        projectId: this.navigationService.currentPoint.projectId,
        name: '',
        id: -1,
        description: '',
        state: State.TODO,
      })
      .catch((err: Error) => {
        this.msg.info(err.message);
        this.shouldFocus = false;
      });
  }

  addLossLink(hazard: HazardTableEntry, chip: Chip): void {
    this.$.pause();
    hazardController
      .updateHazard(hazard)
      .then(() =>
        hazardController
          .createLossLink({
            projectId: this.navigationService.currentPoint.projectId,
            lossId: Number(chip.id),
            hazardId: hazard.id,
          })
          .catch((err: Error) => {
            this.msg.info(err.message);
          })
      )
      .then(() => this.$.resume())
      .catch((err: Error) => {
        this.msg.info(err.message);
      });
  }

  removeLossLink(hazard: HazardTableEntry, chip: Chip): void {
    this.$.pause();
    hazardController
      .updateHazard(hazard)
      .then(() =>
        hazardController
          .removeLossLink({
            hazardId: hazard.id,
            lossId: Number(chip.id),
            projectId: this.navigationService.currentPoint.projectId,
          })
          .catch((err: Error) => this.msg.info(err.message))
      )
      .then(() => this.$.resume())
      .catch((err: Error) => {
        this.msg.info(err.message);
      });
  }

  addSystemConstraintLink(hazard: HazardTableEntry, chip: Chip): void {
    this.$.pause();
    hazardController
      .updateHazard(hazard)
      .then(() =>
        hazardController
          .createSystemConstraintLink({
            projectId: this.navigationService.currentPoint.projectId,
            systemConstraintId: Number(chip.id),
            hazardId: hazard.id,
          })
          .catch((err: Error) => this.msg.info(err.message))
      )
      .then(() => this.$.resume())
      .catch((err: Error) => this.msg.info(err.message));
  }

  removeSystemConstraintLink(hazard: HazardTableEntry, chip: Chip): void {
    this.$.pause();
    hazardController
      .updateHazard(hazard)
      .then(() =>
        hazardController
          .removeSystemConstraintLink({
            hazardId: hazard.id,
            systemConstraintId: Number(chip.id),
            projectId: this.navigationService.currentPoint.projectId,
          })
          .catch((err: Error) => this.msg.info(err.message))
      )
      .then(() => this.$.resume())
      .catch((err: Error) => this.msg.info(err.message));
  }

  addUcaLink(hazard: HazardTableEntry, chip: Chip): void {
    this.$.pause();
    hazardController
      .updateHazard(hazard)
      .then(() =>
        hazardController
          .createUCALink({
            projectId: this.navigationService.currentPoint.projectId,
            unsafeControlActionId: Number(chip.id),
            hazardId: hazard.id,
            controlActionId: -1,
          })
          .catch((err: Error) => this.msg.info(err.message))
      )
      .then(() => this.$.resume())
      .catch((err: Error) => this.msg.info(err.message));
  }

  removeUcaLink(hazard: HazardTableEntry, chip: Chip): void {
    this.$.pause();
    hazardController
      .updateHazard(hazard)
      .then(() =>
        hazardController
          .removeUCALink({
            hazardId: hazard.id,
            unsafeControlActionId: Number(chip.id),
            projectId: this.navigationService.currentPoint.projectId,
            controlActionId: (chip as STPAChip).parentId,
          })
          .catch((err: Error) => this.msg.info(err.message))
      )
      .then(() => this.$.resume())
      .catch((err: Error) => this.msg.info(err.message));
  }

  ngOnDestroy(): void {
    if (this.table.expandedRow) hazardController.updateHazard(this.table.expandedRow);
    this.dataSubscriptions.unsubscribe();
    this.subscriptions.unsubscribe();
  }

  constructor(
    translate: TranslateService,
    private readonly navigationService: AppNavigationService,
    private readonly msg: MessageService
  ) {
    translate
      .get(['STPA.SYSTEMLEVELHAZARDS.NAME', 'STPA.SYSTEMLEVELHAZARDS.TITLE'])
      .pipe(
        tap(res => {
          this.columns = [
            { label: res['STPA.SYSTEMLEVELHAZARDS.NAME'], key: 'name', searchable: true },
            { label: 'Description', key: 'description', searchable: true, hidden: true },
          ];
        })
      )
      .subscribe();
  }
}
