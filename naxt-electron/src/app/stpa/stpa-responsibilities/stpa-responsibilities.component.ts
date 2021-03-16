import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { AppNavigationService, KeyValuePair, MessageService } from '@core/index';
import { TranslateService } from '@ngx-translate/core';
import { Chip, ColumnDefinition, ExpandTimings, Subscriptions, TableComponent } from '@shared/index';
import { responsibilityController, ResponsibilityTableEntry } from '@stpa/index';
import { tap } from 'rxjs/operators';
import { Controller } from '@src-shared/control-structure/models';
import { State } from '@src-shared/Enums';
import { Chip as STPAChip } from '@stpa/src/main/services/models/table-models/Chip';
import { pausable, PausableObservable } from '@shared/utils/PausableObservable';

@Component({
  selector: 'naxt-stpa-responsibilities',
  templateUrl: './stpa-responsibilities.component.html',
  styleUrls: ['./stpa-responsibilities.component.scss'],
})
export class StpaResponsibilitiesComponent implements AfterViewInit, OnDestroy {
  private readonly subscriptions: Subscriptions = new Subscriptions();
  private readonly dataSubscriptions: Subscriptions = new Subscriptions();
  @ViewChild(TableComponent) table: TableComponent<ResponsibilityTableEntry>;
  menuList: Controller[] = [];
  responsibilityData: ResponsibilityTableEntry[] = [];
  private shouldCreateNew: boolean = false;
  // private result: BottomSheetResult<ControllerTableEntry, TableEntry, TableEntry>;
  private shouldFocus: boolean = false;
  private firstLoad: boolean = true;

  ngAfterViewInit(): void {
    this.subscriptions.plusOne = responsibilityController
      .getRequiredEntries$(this.navigationService.currentPoint.projectId)
      .pipe(
        tap(controller => {
          this.menuList = controller;
        })
      )
      .subscribe();
    this.subscriptions.plusOne = this.table.rowExpanded
      .pipe(tap(responsibility => this.navigationService.setNewKeyValue(new KeyValuePair(responsibility.tableId))))
      .subscribe();

    this.subscriptions.plusOne = this.table.rowCollapsed
      .pipe(
        tap(responsibility => {
          responsibilityController
            .updateResponsibility(responsibility)
            .catch((err: Error) => this.msg.info(err.message));
          this.navigationService.setNewKeyValue(undefined);

          if (this.shouldCreateNew) {
            this.shouldCreateNew = false;
            this.backendCreate(this.chosenController);
          }
        })
      )
      .subscribe();

    this.subscriptions.plusOne = this.table.rowDelete
      .pipe(
        tap(event => {
          responsibilityController.removeResponsibility(event.row).catch((err: Error) => this.msg.info(err.message));
        })
      )
      .subscribe();

    // called if project changes but subcompinent (loss, uc etc.) did not change!
    this.subscriptions.plusOne = this.navigationService.activePoint
      .pipe(
        tap(() => {
          // saves active row on project change
          if (!!this.table?.expandedRow)
            responsibilityController
              .updateResponsibility(this.table.expandedRow)
              .catch((err: Error) => this.msg.info(err.message));

          // resubscribse to data of the new project
          this.dataSubscriptions.unsubscribe();
          this.initDataSubscriptions();
        })
      )
      .subscribe();
  }

  $: PausableObservable<ResponsibilityTableEntry[]>;
  initDataSubscriptions(): void {
    this.$ = responsibilityController.getAll$(this.navigationService.currentPoint.projectId).pipe(
      tap(v => {
        this.responsibilityData = v;
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
    ) as PausableObservable<ResponsibilityTableEntry[]>;
    this.dataSubscriptions.plusOne = this.$.subscribe();
  }
  addControllerConstraintLink(responsibility: ResponsibilityTableEntry, chip: Chip): void {
    this.$.pause();
    responsibilityController
      .updateResponsibility(responsibility)
      .then(() =>
        responsibilityController
          .createSystemConstraintLink({
            systemConstraintId: Number(chip.id),
            responsibilityId: responsibility.id,
            projectId: this.navigationService.currentPoint.projectId,
          })
          .catch((err: Error) => this.msg.info(err.message))
      )
      .then(() => this.$.resume())
      .catch((err: Error) => this.msg.info(err.message));
  }

  removeControllerConstraintLink(responsibility: ResponsibilityTableEntry, chip: Chip): void {
    this.$.pause();
    responsibilityController
      .updateResponsibility(responsibility)
      .then(() =>
        responsibilityController
          .removeSystemConstraintLink({
            systemConstraintId: Number(chip.id),
            responsibilityId: responsibility.id,
            projectId: this.navigationService.currentPoint.projectId,
          })
          .catch((err: Error) => this.msg.info(err.message))
      )
      .then(() => this.$.resume())
      .catch((err: Error) => this.msg.info(err.message));
  }

  addSubSystemConstraintLink(responsibility: ResponsibilityTableEntry, chip: Chip): void {
    this.$.pause();
    responsibilityController
      .updateResponsibility(responsibility)
      .then(() =>
        responsibilityController
          .createSubSystemConstraintLink({
            systemConstraintId: Number((chip as STPAChip).parentId),
            subSystemConstraintId: Number(chip.id),
            responsibilityId: responsibility.id,
            projectId: this.navigationService.currentPoint.projectId,
          })
          .catch((err: Error) => this.msg.info(err.message))
      )
      .then(() => this.$.resume())
      .catch((err: Error) => this.msg.info(err.message));
  }

  removeSubSystemConstraintLink(responsibility: ResponsibilityTableEntry, chip: Chip): void {
    this.$.pause();
    responsibilityController
      .updateResponsibility(responsibility)
      .then(() =>
        responsibilityController
          .removeSubSystemConstraintLink({
            systemConstraintId: Number((chip as STPAChip).parentId),
            subSystemConstraintId: Number(chip.id),
            responsibilityId: responsibility.id,
            projectId: this.navigationService.currentPoint.projectId,
          })
          .catch((err: Error) => this.msg.info(err.message))
      )
      .then(() => this.$.resume())
      .catch((err: Error) => this.msg.info(err.message));
  }

  ngOnDestroy(): void {
    if (this.table.expandedRow)
      responsibilityController
        .updateResponsibility(this.table.expandedRow)
        .catch((err: Error) => this.msg.info(err.message));
    this.dataSubscriptions.unsubscribe();
    this.subscriptions.unsubscribe();
  }

  chosenController: Controller;
  createResponsibilities(event): void {
    this.chosenController = event;
    // checks if a loss has no name, then don#t create another
    if (
      this.shouldCreateNew ||
      this.responsibilityData.filter(responsibility => !responsibility.name || responsibility.name.length <= 0).length >
        0
    )
      return;

    if (!!this.table.expandedRow) {
      this.shouldCreateNew = true;
      this.table.collapseRows();
    } else this.backendCreate(this.chosenController);
  }
  backendCreate(chosenController: Controller): void {
    this.shouldFocus = true;
    responsibilityController
      .createResponsibility({
        id: -1,
        projectId: this.navigationService.currentPoint.projectId,
        name: '',
        description: '',
        controllerId: chosenController.id,
        controllerProjectId: this.navigationService.currentPoint.projectId,
        state: State.TODO,
      })
      .catch((err: Error) => {
        this.msg.info(err.message);
        this.shouldFocus = false;
      });
  }

  columns: ColumnDefinition[] = [
    { label: 'ID', key: 'id', searchable: false },
    { label: 'STPA.RESPONSIBILITIES.NAME', key: 'name', searchable: true },
    { label: 'Description', key: 'description', searchable: true, hidden: true },
  ];

  constructor(
    translate: TranslateService,
    private readonly navigationService: AppNavigationService,
    private readonly msg: MessageService
  ) {
    translate
      .get(['STPA.RESPONSIBILITIES.NAME', 'STPA.RESPONSIBILITIES.TITLE'])
      .pipe(
        tap(res => {
          this.columns = [
            { label: res['STPA.RESPONSIBILITIES.NAME'], key: 'name', searchable: true },
            { label: 'Description', key: 'description', searchable: true, hidden: true },
          ];
        })
      )
      .subscribe();
  }
}
