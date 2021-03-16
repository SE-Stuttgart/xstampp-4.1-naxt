import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { AppNavigationService, KeyValuePair, MessageService } from '@core/index';
import { TranslateService } from '@ngx-translate/core';
import { Chip, ColumnDefinition, ExpandTimings, Subscriptions, TableComponent } from '@shared/index';
import { tap } from 'rxjs/operators';
import { UCACategory, unsafeControlActionController, UnsafeControlActionTableEntry } from '@stpa/index';
import { State } from '@src-shared/Enums';
import { ControlAction } from '@src-shared/control-structure/models';
import { Chip as STPAChip } from '@stpa/src/main/services/models/table-models/Chip';
import { pausable, PausableObservable } from '@shared/utils/PausableObservable';

@Component({
  selector: 'naxt-stpa-uca',
  templateUrl: './stpa-uca.component.html',
  styleUrls: ['./stpa-uca.component.scss'],
})
export class StpaUcaComponent implements AfterViewInit, OnDestroy {
  private readonly subscriptions: Subscriptions = new Subscriptions();
  private readonly dataSubscriptions: Subscriptions = new Subscriptions();
  @ViewChild(TableComponent) table: TableComponent<UnsafeControlActionTableEntry>;
  menuList: ControlAction[] = [];
  ucaData: UnsafeControlActionTableEntry[] = [];
  private shouldCreateNew: boolean = false;
  dropdownList: { value: string; label: string }[] = [
    { value: UCACategory.NotProvided, label: UCACategory.NotProvided },
    { value: UCACategory.Provided, label: UCACategory.Provided },
    { value: UCACategory.STSOATL, label: UCACategory.STSOATL },
    { value: UCACategory.TETL, label: UCACategory.TETL },
  ];
  // private result: BottomSheetResult<UnsafeControlActionCategoryTableEntry, ControlActionTableEntry, TableEntry>;
  private shouldFocus: boolean = false;
  private firstLoad: boolean = true;

  ngAfterViewInit(): void {
    this.subscriptions.plusOne = unsafeControlActionController
      .getRequiredEntries$(this.navigationService.currentPoint.projectId)
      .pipe(
        tap(controlAction => {
          this.menuList = controlAction;
        })
      )
      .subscribe();

    this.subscriptions.plusOne = this.table.rowExpanded
      .pipe(
        tap(unsafeControlAction => this.navigationService.setNewKeyValue(new KeyValuePair(unsafeControlAction.tableId)))
      )
      .subscribe();

    this.subscriptions.plusOne = this.table.rowCollapsed
      .pipe(
        tap(unsafeControlAction => {
          unsafeControlActionController.updateUnsafeControlAction(unsafeControlAction);
          this.navigationService.setNewKeyValue(undefined);

          if (this.shouldCreateNew) {
            this.shouldCreateNew = false;
            this.backendCreate(this.chosenControlAction);
          }
        })
      )
      .subscribe();

    this.subscriptions.plusOne = this.table.rowDelete
      .pipe(
        tap(event => {
          unsafeControlActionController.removeUnsafeControlAction(event.row);
        })
      )
      .subscribe();

    // called if project changes but subcompinent (loss, uc etc.) did not change!
    this.subscriptions.plusOne = this.navigationService.activePoint
      .pipe(
        tap(() => {
          // saves active row on project change
          if (!!this.table?.expandedRow)
            unsafeControlActionController
              .updateUnsafeControlAction(this.table.expandedRow)
              .catch((err: Error) => this.msg.info(err.message));

          // resubscribse to data of the new project
          this.dataSubscriptions.unsubscribe();
          this.initDataSubscriptions();
        })
      )
      .subscribe();
  }

  $: PausableObservable<UnsafeControlActionTableEntry[]>;
  initDataSubscriptions(): void {
    this.$ = unsafeControlActionController.getAll$(this.navigationService.currentPoint.projectId).pipe(
      tap(v => {
        this.ucaData = v;
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
    ) as PausableObservable<UnsafeControlActionTableEntry[]>;
    this.dataSubscriptions.plusOne = this.$.subscribe();
  }

  ngOnDestroy(): void {
    if (this.table.expandedRow) unsafeControlActionController.updateUnsafeControlAction(this.table.expandedRow);
    this.dataSubscriptions.unsubscribe();
    this.subscriptions.unsubscribe();
  }

  chosenControlAction: ControlAction;

  createUnsafeControlAction(event): void {
    // checks if a loss has no name, then don#t create another
    this.chosenControlAction = event;
    if (
      this.shouldCreateNew ||
      this.ucaData.filter(unsafeControlAction => !unsafeControlAction.name || unsafeControlAction.name.length <= 0)
        .length > 0
    )
      return;

    if (!!this.table.expandedRow) {
      this.shouldCreateNew = true;
      // this.result = result;
      this.table.collapseRows();
    } else this.backendCreate(this.chosenControlAction);
  }

  backendCreate(chosenControlAction: ControlAction): void {
    this.shouldFocus = true;
    unsafeControlActionController
      .createUnsafeControlAction({
        id: -1,
        projectId: this.navigationService.currentPoint.projectId,
        parentId: chosenControlAction.id,
        category: UCACategory.NotProvided,
        name: '',
        description: '',
        state: State.TODO,
        formal: '',
        formalDescription: '',
      })
      .catch((err: Error) => {
        this.msg.info(err.message);
        this.shouldFocus = false;
      });
  }

  addHazardLink(uca: UnsafeControlActionTableEntry, chip: Chip): void {
    this.$.pause();
    unsafeControlActionController
      .updateUnsafeControlAction(uca)
      .then(() =>
        unsafeControlActionController
          .createHazardLink({
            hazardId: Number(chip.id),
            unsafeControlActionId: uca.id,
            controlActionId: uca.parentId,
            projectId: this.navigationService.currentPoint.projectId,
          })
          .catch((err: Error) => this.msg.info(err.message))
      )
      .then(() => this.$.resume())
      .catch((err: Error) => this.msg.info(err.message));
  }

  removeHazardLink(uca: UnsafeControlActionTableEntry, chip: Chip): void {
    this.$.pause();
    unsafeControlActionController
      .updateUnsafeControlAction(uca)
      .then(() =>
        unsafeControlActionController
          .removeHazardLink({
            hazardId: Number(chip.id),
            unsafeControlActionId: uca.id,
            controlActionId: uca.parentId,
            projectId: this.navigationService.currentPoint.projectId,
          })
          .catch((err: Error) => this.msg.info(err.message))
      )
      .then(() => this.$.resume())
      .catch((err: Error) => this.msg.info(err.message));
  }

  addSubHazardLink(uca: UnsafeControlActionTableEntry, chip: Chip): void {
    this.$.pause();
    unsafeControlActionController
      .updateUnsafeControlAction(uca)
      .then(() =>
        unsafeControlActionController
          .createSubHazardLink({
            hazardId: (chip as STPAChip).parentId,
            subHazardId: Number(chip.id),
            unsafeControlActionId: uca.id,
            controlActionId: uca.parentId,
            projectId: this.navigationService.currentPoint.projectId,
          })
          .catch((err: Error) => this.msg.info(err.message))
      )
      .then(() => this.$.resume())
      .catch((err: Error) => this.msg.info(err.message));
  }

  removeSubHazardLink(uca: UnsafeControlActionTableEntry, chip: Chip): void {
    this.$.pause();
    unsafeControlActionController
      .updateUnsafeControlAction(uca)
      .then(() =>
        unsafeControlActionController
          .removeSubHazardLink({
            hazardId: (chip as STPAChip).parentId,
            subHazardId: Number(chip.id),
            unsafeControlActionId: uca.id,
            controlActionId: uca.parentId,
            projectId: this.navigationService.currentPoint.projectId,
          })
          .catch((err: Error) => this.msg.info(err.message))
      )
      .then(() => this.$.resume())
      .catch((err: Error) => this.msg.info(err.message));
  }

  columns: ColumnDefinition[] = [
    { label: 'ID', key: 'id', searchable: false },
    { label: 'STPA.UCA.NAME', key: 'name', searchable: true },
    { label: 'Description', key: 'description', searchable: true, hidden: true },
  ];

  constructor(
    translate: TranslateService,
    private readonly navigationService: AppNavigationService,
    private readonly msg: MessageService
  ) {
    translate
      .get(['STPA.UCA.NAME', 'STPA.UCA.TITLE'])
      .pipe(
        tap(res => {
          this.columns = [
            { label: res['STPA.UCA.NAME'], key: 'name', searchable: true },
            { label: 'Description', key: 'description', searchable: true, hidden: true },
          ];
        })
      )
      .subscribe();
  }
}
