import { AfterViewInit, Component, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { AppNavigationService, ElectronService, KeyValuePair, MessageService } from '@core/index';
import { TranslateService } from '@ngx-translate/core';
import {
  Chip,
  ColumnDefinition,
  DialogData,
  EditorConfig,
  ExpandTimings,
  NestedEmit,
  Subscriptions,
  TableComponent,
} from '@shared/index';
import { tap } from 'rxjs/operators';
import { processVariableController, ProcessVariableTableEntry, RequiredModels, VariableType } from '@stpa/index';
import { State } from '@src-shared/Enums';
import { IpcKeys, StoreKeys } from '../../../../enum-keys';
import { LogicService } from '../services/logic.service';
import { pausable, PausableObservable } from '@shared/utils/PausableObservable';

@Component({
  selector: 'naxt-stpa-process-variables',
  templateUrl: './stpa-process-variables.component.html',
  styleUrls: ['./stpa-process-variables.component.scss'],
})
export class StpaProcessVariablesComponent implements AfterViewInit, OnDestroy {
  readonly VariableType = VariableType;
  showExtendedView: boolean = false;
  editMode: boolean = false;
  parsedTerm: string = '';

  private readonly subscriptions: Subscriptions = new Subscriptions();
  private readonly dataSubscriptions: Subscriptions = new Subscriptions();
  @ViewChild(TableComponent) table: TableComponent<ProcessVariableTableEntry>;

  menuMapProcessVariable: RequiredModels = { nestedModels: [] };
  processVariableData: ProcessVariableTableEntry[] = [];
  private shouldCreateNew: boolean = false;
  private shouldFocus: boolean = false;
  private firstLoad: boolean = true;

  get variableList(): { value: string; insert: string }[] {
    return this.processVariableData.map(v => ({
      value: v.name,
      insert: `${v.tableId}|name`,
    }));
  }

  get stateList(): { value: string; insert: string }[] {
    return this.processVariableData.flatMap(v => {
      if (v?.variable_type === VariableType.Discrete)
        return [
          ...v.possibleVariableValues.map(s => ({
            value: `${v.name}.${s}`,
            insert: s,
          })),
        ];
      else return [];
    });
  }

  get valueList(): { value: string; insert: string }[] {
    return this.processVariableData
      .filter(v => v.tableId !== this.table?.expandedTableId)
      .map(v => ({
        value: `${v.name} value`,
        insert: `${v.tableId}|value`,
      }));
  }

  getEditorConfig(): EditorConfig[] {
    return [
      {
        key: '@',
        list: this.variableList,
      },
      {
        key: '#',
        list: this.stateList,
      },
      {
        key: '$',
        list: this.valueList,
      },
    ];
  }

  // editorConfigs: EditorConfig[] = [];

  ngAfterViewInit(): void {
    processVariableController
      .getRequiredEntries$(this.navigationService.currentPoint.projectId)
      .pipe(
        tap(systemConstraint => {
          this.menuMapProcessVariable = systemConstraint;
        })
      )
      .subscribe();
    this.subscriptions.plusOne = this.table.rowExpanded
      .pipe(tap(processVariable => this.navigationService.setNewKeyValue(new KeyValuePair(processVariable.tableId))))
      .subscribe();

    this.subscriptions.plusOne = this.table.rowCollapsed
      .pipe(
        tap(async processVariable => {
          this.editMode = false;
          await this.beforeUpdate(processVariable);
          processVariableController
            .updateProcessVariable(processVariable)
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
          processVariableController.removeProcessVariable(event.row).catch((err: Error) => this.msg.info(err.message));
        })
      )
      .subscribe();

    // called if project changes but subcompinent (loss, uc etc.) did not change!
    this.subscriptions.plusOne = this.navigationService.activePoint
      .pipe(
        tap(async () => {
          // saves active row on project change
          if (!!this.table?.expandedRow) {
            await this.beforeUpdate(this.table.expandedRow);
            processVariableController
              .updateProcessVariable(this.table.expandedRow)
              .catch((err: Error) => this.msg.info(err.message));
          }

          // resubscribse to data of the new project
          this.dataSubscriptions.unsubscribe();
          this.initDataSubscriptions();
        })
      )
      .subscribe();
  }

  $: PausableObservable<ProcessVariableTableEntry[]>;
  initDataSubscriptions(): void {
    this.$ = processVariableController.getAll$(this.navigationService.currentPoint.projectId).pipe(
      tap(v => {
        this.processVariableData = v;
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
    ) as PausableObservable<ProcessVariableTableEntry[]>;
    this.dataSubscriptions.plusOne = this.$.subscribe();
  }

  async ngOnDestroy(): Promise<void> {
    if (!!this.table?.expandedRow) {
      await this.beforeUpdate(this.table.expandedRow);
      processVariableController
        .updateProcessVariable(this.table.expandedRow)
        .catch((err: Error) => this.msg.info(err.message));
    }
    this.dataSubscriptions.unsubscribe();
    this.subscriptions.unsubscribe();
  }

  backendCreate(): void {
    this.shouldFocus = true;
    processVariableController
      .createProcessVariable({
        projectId: this.navigationService.currentPoint.projectId,
        name: '',
        description: '',
        id: -1,
        variable_type: VariableType.Discrete,
        arrowId: '',
        state: State.TODO,
        spinName: '',
        nuSMVName: '',
      })
      .then(processVariable => {
        processVariableController
          .createProcessModelLink({
            processModelId: this.chosenMenuEntries.sub.id,
            processVariableId: processVariable.id,
            processVariableValue: '',
            projectId: this.navigationService.currentPoint.projectId,
          })
          .catch((err: Error) => console.warn(err.message));
      })
      .catch((err: Error) => {
        this.msg.info(err.message);
        this.shouldFocus = false;
      });
  }

  chosenMenuEntries: NestedEmit;
  createProcessVariable(event: NestedEmit): void {
    this.chosenMenuEntries = event;
    if (this.shouldCreateNew || this.processVariableData.filter(loss => !loss.name || loss.name.length <= 0).length > 0)
      return;

    if (!!this.table.expandedRow) {
      this.shouldCreateNew = true;
      this.table.collapseRows();
    } else this.backendCreate();
  }

  async createProcessModelLink(processVariable: ProcessVariableTableEntry, chip: Chip): Promise<void> {
    this.$.pause();
    await this.beforeUpdate(processVariable);
    processVariableController
      .updateProcessVariable(processVariable)
      .then(() =>
        processVariableController
          .createProcessModelLink({
            processModelId: Number(chip.id),
            processVariableId: processVariable.id,
            processVariableValue: processVariable.currentVariableValue,
            projectId: this.navigationService.currentPoint.projectId,
          })
          .catch((err: Error) => this.msg.info(err.message))
      )
      .then(() => this.$.resume())
      .catch((err: Error) => this.msg.info(err.message));
  }

  async removeProcessModelLink(processVariable: ProcessVariableTableEntry, chip: Chip): Promise<void> {
    this.$.pause();
    await this.beforeUpdate(processVariable);
    processVariableController
      .updateProcessVariable(processVariable)
      .then(() =>
        processVariableController
          .removeProcessModelLink({
            processModelId: Number(chip.id),
            processVariableId: processVariable.id,
            processVariableValue: processVariable.currentVariableValue,
            projectId: this.navigationService.currentPoint.projectId,
          })
          .catch((err: Error) => this.msg.info(err.message))
      )
      .then(() => this.$.resume())
      .catch((err: Error) => this.msg.info(err.message));
  }

  async createResponsibilityLink(processVariable: ProcessVariableTableEntry, chip: Chip): Promise<void> {
    this.$.pause();
    await this.beforeUpdate(processVariable);
    processVariableController
      .updateProcessVariable(processVariable)
      .then(() =>
        processVariableController
          .createResponsibilityLink({
            responsibilityId: Number(chip.id),
            processVariableId: processVariable.id,
            projectId: this.navigationService.currentPoint.projectId,
          })
          .catch((err: Error) => this.msg.info(err.message))
      )
      .then(() => this.$.resume())
      .catch((err: Error) => this.msg.info(err.message));
  }

  async removeResponsibilityLink(processVariable: ProcessVariableTableEntry, chip: Chip): Promise<void> {
    this.$.pause();
    await this.beforeUpdate(processVariable);
    processVariableController
      .updateProcessVariable(processVariable)
      .then(() =>
        processVariableController
          .removeResponsibilityLink({
            responsibilityId: Number(chip.id),
            processVariableId: processVariable.id,
            projectId: this.navigationService.currentPoint.projectId,
          })
          .catch((err: Error) => this.msg.info(err.message))
      )
      .then(() => this.$.resume())
      .catch((err: Error) => this.msg.info(err.message));
  }

  async createInputLink(processVariable: ProcessVariableTableEntry, chip: Chip): Promise<void> {
    this.$.pause();
    await this.beforeUpdate(processVariable);
    processVariableController
      .updateProcessVariable({
        description: processVariable.description,
        id: processVariable.id,
        name: processVariable.name,
        projectId: this.navigationService.currentPoint.projectId,
        state: processVariable.state,
        variable_type: processVariable.variable_type,
        arrowId: String(chip.id),
        spinName: processVariable.spinName,
        nuSMVName: processVariable.nuSMVName,
      })
      .then(processVariable => {
        this.table.expandedRow.arrowId = processVariable.arrowId;
      })
      .then(() => this.$.resume())
      .catch((err: Error) => this.msg.info(err.message));
  }

  async removeInputLink(processVariable: ProcessVariableTableEntry, _chip: Chip): Promise<void> {
    this.$.pause();
    await this.beforeUpdate(processVariable);
    processVariableController
      .updateProcessVariable({
        description: processVariable.description,
        id: processVariable.id,
        name: processVariable.name,
        projectId: this.navigationService.currentPoint.projectId,
        state: processVariable.state,
        variable_type: processVariable.variable_type,
        arrowId: '',
        spinName: processVariable.spinName,
        nuSMVName: processVariable.nuSMVName,
      })
      .then(() => this.$.resume())
      .catch((err: Error) => this.msg.info(err.message));
  }

  columns: ColumnDefinition[] = [];
  async beforeUpdate(v: ProcessVariableTableEntry): Promise<void> {
    await processVariableController.replaceAllDiscreteValues(
      v.projectId,
      v.id,
      v.possibleVariableValues.map(subVal => ({
        processVariableId: v.id,
        projectId: v.projectId,
        variableValue: subVal,
      }))
    );

    for (const model of v.processModelChips) {
      await processVariableController.updateProcessModelLink({
        processModelId: model.id as number,
        processVariableId: v.id,
        projectId: v.projectId,
        processVariableValue: v.currentVariableValue,
      });
    }
  }

  parseTerm(term: string): string {
    try {
      return this.ltlService.parseTerm(this.processVariableData, term, void 0);
    } catch (e) {
      return e?.message;
    }
  }
  helpDialogData: DialogData;
  getHelp(): void {
    this.msg.dialog({ data: this.helpDialogData });
  }

  constructor(
    translate: TranslateService,
    private readonly navigationService: AppNavigationService,
    private readonly msg: MessageService,
    private readonly ltlService: LogicService,
    private readonly electronService: ElectronService,
    private readonly ngZone: NgZone
  ) {
    /**
     * for help-dialog!
     */
    translate
      .get(['STPA.UCAREFINEMENT.HELPTITLE', 'STPA.UCAREFINEMENT.HELPBODY'])
      .pipe(
        tap(res => {
          this.helpDialogData = {
            headline: res['STPA.UCAREFINEMENT.HELPTITLE'],
            text: res['STPA.UCAREFINEMENT.HELPBODY'],
          };
        })
      )
      .subscribe();

    translate
      .get(['STPA.PROCESSVARIABLES.NAME', 'STPA.PROCESSVARIABLES.TITLE'])
      .pipe(
        tap(res => {
          this.columns = [
            { label: res['STPA.PROCESSVARIABLES.NAME'], key: 'name', searchable: true },
            { label: 'Description', key: 'description', searchable: true, hidden: true },
          ];
        })
      )
      .subscribe();

    this.electronService.ipcRenderer.on(IpcKeys.EXTENDED, (event, args) => {
      this.ngZone.run(() => {
        this.showExtendedView = args;
      });
    });

    this.electronService.ipcRenderer
      .invoke(IpcKeys.STORE, StoreKeys.EXTENDED)
      .then(s => {
        this.ngZone.run(() => {
          this.showExtendedView = s;
        });
      })
      .catch();
  }
}
