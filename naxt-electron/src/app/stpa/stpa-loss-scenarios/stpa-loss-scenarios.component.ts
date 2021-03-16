import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppNavigationService, KeyValuePair, MessageService } from '@core/index';
import { TranslateService } from '@ngx-translate/core';
import {
  ColumnDefinition,
  ExpandTimings,
  NestedEmit,
  Subscriptions,
  TableComponent,
  UpdateTiming,
} from '@shared/index';
import {
  HeadCategory,
  lossScenarioController,
  LossScenarioTableEntry,
  Reason,
  RequiredModels,
  SubCategory,
} from '@stpa/index';
import { auditTime, tap } from 'rxjs/operators';
import { State } from '@src-shared/Enums';

@Component({
  selector: 'naxt-stpa-lossScenario-scenarios',
  templateUrl: './stpa-loss-scenarios.component.html',
  styleUrls: ['./stpa-loss-scenarios.component.scss'],
})
export class StpaLossScenariosComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly subscriptions: Subscriptions = new Subscriptions();
  private readonly dataSubscriptions: Subscriptions = new Subscriptions();
  @ViewChild(TableComponent) table: TableComponent<LossScenarioTableEntry>;
  lossScenarioData: LossScenarioTableEntry[] = [];
  failures: string = HeadCategory.FailureRelatedToController;
  inadequateCa: string = HeadCategory.InadequateControlAlgorithm;
  inadequatePm: string = HeadCategory.InadequateProcessModel;
  unsafeCI: string = HeadCategory.UnsafeControlInput;
  menuMapLossScenario: RequiredModels = { nestedModels: [] };
  private shouldCreateNew: boolean = false;
  private shouldFocus: boolean = false;
  private firstLoad: boolean = true;
  chosenController: number;
  chosenDescription1: string;
  ngAfterViewInit(): void {
    this.subscriptions.plusOne = lossScenarioController
      .getRequiredEntries$(this.navigationService.currentPoint.projectId)
      .pipe(
        auditTime(UpdateTiming.REGUALR),
        tap(v => {
          this.menuMapLossScenario = v;
        })
      )
      .subscribe();

    this.subscriptions.plusOne = this.table.rowExpanded
      .pipe(
        tap(lossScenario => {
          this.navigationService.setNewKeyValue(new KeyValuePair(lossScenario.tableId));
        })
      )
      .subscribe();

    this.subscriptions.plusOne = this.table.rowCollapsed
      .pipe(
        tap(lossScenario => {
          lossScenarioController.update(lossScenario).catch((err: Error) => this.msg.info(err.message));
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
          lossScenarioController.remove(event.row).catch((err: Error) => this.msg.info(err.message));
        })
      )
      .subscribe();

    // called if project changes but subcompinent (lossScenario, uc etc.) did not change!
    this.subscriptions.plusOne = this.navigationService.activePoint
      .pipe(
        tap(() => {
          // saves active row on project change
          if (!!this.table?.expandedRow)
            lossScenarioController.update(this.table.expandedRow).catch((err: Error) => this.msg.info(err.message));

          // resubscribse to data of the new project
          this.dataSubscriptions.unsubscribe();
          this.initDataSubscriptions();
        })
      )
      .subscribe();
  }
  initDataSubscriptions(): void {
    this.dataSubscriptions.plusOne = lossScenarioController
      .getAll$(this.navigationService.currentPoint.projectId)
      .pipe(
        auditTime(UpdateTiming.REGUALR),
        tap(v => {
          this.lossScenarioData = v;

          // opens selecten row if needed
          if (this.firstLoad) {
            this.firstLoad = false;
            if (this.table?.expandedRow?.tableId !== this.navigationService.currentPoint.keyValuePair?.value) {
              setTimeout(() => {
                this.table.activateRowByPair(this.navigationService.currentPoint.keyValuePair);
              }, ExpandTimings.REGULAR);
            }
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
      lossScenarioController.update(this.table.expandedRow).catch((err: Error) => this.msg.info(err.message));
    this.dataSubscriptions.unsubscribe();
    this.subscriptions.unsubscribe();
  }
  chosenMenuEntries: NestedEmit;
  createLossScenario(event: NestedEmit): void {
    // checks if a loss has no name, then don#t create another
    this.chosenMenuEntries = event;
    if (
      this.shouldCreateNew ||
      this.lossScenarioData.filter(lossScenario => !lossScenario.name || lossScenario.name.length <= 0).length > 0
    )
      return;

    if (!!this.table.expandedRow) {
      this.shouldCreateNew = true;
      this.table.collapseRows();
    } else this.backendCreate();
  }

  backendCreate(): void {
    this.shouldFocus = true;
    lossScenarioController
      .create({
        id: -1,
        projectId: this.navigationService.currentPoint.projectId,

        name: '',
        description: '',
        state: State.TODO,

        ucaId: this.chosenMenuEntries.sub.id,
        headCategory: HeadCategory.FailureRelatedToController,
        subCategory: SubCategory.None,
        controller1Id: null,
        controller2Id: null,
        controlAlgorithm: null,
        description1: '',
        description2: '',
        description3: '',
        controlActionId: this.chosenMenuEntries.main.id,
        inputArrowId: null,
        feedbackArrowId: null,
        inputBoxId: '',
        sensorId: null,
        reason: Reason.None,
      })
      .catch((err: Error) => {
        this.msg.info(err.message);
        this.shouldFocus = false;
      });
  }

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  chosenControlAction: string = '';
  chosenUca: string = '';
  chosenCategory = '';
  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.thirdFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
  }

  listOfCategories = [
    { value: HeadCategory.FailureRelatedToController, label: HeadCategory.FailureRelatedToController },
    { value: HeadCategory.InadequateControlAlgorithm, label: HeadCategory.InadequateControlAlgorithm },
    { value: HeadCategory.InadequateProcessModel, label: HeadCategory.InadequateProcessModel },
    { value: HeadCategory.UnsafeControlInput, label: HeadCategory.UnsafeControlInput },
  ];

  columns: ColumnDefinition[] = [
    { label: 'STPA.LOSSSCENARIOS.NAME', key: 'name', searchable: true },
    { label: 'Description', key: 'description', searchable: true, hidden: true },
  ];
  listOfThings: Array<string> = ['test1', 'test2'];
  selectedValue: string = 'test1';

  constructor(
    private _formBuilder: FormBuilder,
    translate: TranslateService,
    private readonly navigationService: AppNavigationService,
    private readonly msg: MessageService
  ) {
    translate
      .get(['STPA.LOSSSCENARIOS.NAME', 'STPA.LOSSSCENARIOS.TITLE'])
      .pipe(
        tap(res => {
          this.columns = [
            { label: res['STPA.LOSSSCENARIOS.NAME'], key: 'name', searchable: true },
            { label: 'Description', key: 'description', searchable: true, hidden: true },
          ];
        })
      )
      .subscribe();
  }
  test: string = 'test';
  componentShouldShow(name: string): boolean {
    return this.chosenCategory === name;
  }
}
