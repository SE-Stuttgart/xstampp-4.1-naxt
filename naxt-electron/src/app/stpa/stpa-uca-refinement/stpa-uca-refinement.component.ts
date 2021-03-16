import { AfterViewInit, Component, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { AppNavigationService, ElectronService, KeyValuePair, MessageService } from '@core/index';
import { TranslateService } from '@ngx-translate/core';
import {
  ColumnDefinition,
  DialogData,
  EditorConfig,
  ExpandTimings,
  Subscriptions,
  TableComponent,
  UpdateTiming,
} from '@shared/index';
import { auditTime, tap } from 'rxjs/operators';
import {
  processVariableController,
  ProcessVariableTableEntry,
  unsafeControlActionController,
  UnsafeControlActionTableEntry,
  VariableType,
} from '@stpa/index';
import { MatProgressButtonOptions } from 'mat-progress-buttons';
import { IpcKeys, StoreKeys } from '../../../../enum-keys';
import { LogicService } from '../services/logic.service';
import { VerificationService } from '../services/verification.service';

@Component({
  selector: 'naxt-stpa-uca-refinement',
  templateUrl: './stpa-uca-refinement.component.html',
  styleUrls: ['./stpa-uca-refinement.component.scss'],
})
export class StpaUcaRefinementComponent implements AfterViewInit, OnDestroy {
  private readonly subscriptions: Subscriptions = new Subscriptions();
  private readonly dataSubscriptions: Subscriptions = new Subscriptions();

  @ViewChild(TableComponent) table: TableComponent<UnsafeControlActionTableEntry>;

  isPromelaMode: boolean = false;
  nuSmvPath: string;
  spinPath: string;
  mode: string | number = 'ltl';
  editMode: boolean = false;
  parsedTerm: string = '';
  ucaData: UnsafeControlActionTableEntry[] = [];
  processVariables: ProcessVariableTableEntry[] = [];
  private shouldCreateNew: boolean = false;
  // private result: BottomSheetResult<UnsafeControlActionCategoryTableEntry, ControlActionTableEntry, TableEntry>;
  private shouldFocus: boolean = false;
  private firstLoad: boolean = true;

  get nuSmvMode(): string {
    return this.mode === 'ltl' ? 'LTLSPEC' : 'CTLSPEC';
  }

  getPromela(term: string): void {
    this.ltlService.getPromela(this.processVariables, term, this.ucaData);
  }

  getNuSMV(term: string): void {
    this.ltlService.getNuSMV(this.processVariables, term, this.ucaData);
  }

  parseTerm(term: string): string {
    try {
      return this.ltlService.parseTerm(this.processVariables, term, this.ucaData);
    } catch (e) {
      return e.message;
    }
  }
  get variableList(): { value: string; insert: string }[] {
    return this.processVariables.map(v => ({
      value: v.name,
      insert: `${v.tableId}|name`,
    }));
  }

  get stateList(): { value: string; insert: string }[] {
    return this.processVariables.flatMap(v => {
      if (v?.variable_type === VariableType.Discrete)
        return [
          ...v.possibleVariableValues.map(s => ({
            value: `${v.name}.${s}`,
            insert: `${v.tableId}|${s}|state`,
          })),
        ];
      else return [];
    });
  }

  get valueList(): { value: string; insert: string }[] {
    return this.processVariables.map(v => ({
      value: `${v.name} value`,
      insert: `${v.tableId}|value`,
    }));
  }

  get ucaValueList(): { value: string; insert: string }[] {
    return this.ucaData
      .filter(uca => uca.tableId !== this.table?.expandedTableId)
      .map(uca => ({
        value: `${uca?.tableId}`,
        insert: `${uca?.tableId}|uca`,
      }));
  }

  get editorConfigs(): EditorConfig[] {
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
      {
        key: '§',
        list: this.ucaValueList,
      },
    ];
  }

  btnOpts: MatProgressButtonOptions = {
    active: false,
    text: 'NuSMV Check',
    spinnerSize: 19,
    raised: true,
    stroked: false,
    buttonColor: 'primary',
    spinnerColor: 'accent',
    fullWidth: false,
    disabled: false,
    mode: 'indeterminate',
  };

  btnOpts1: MatProgressButtonOptions = {
    active: false,
    text: 'SPIN Check',
    spinnerSize: 19,
    raised: true,
    stroked: false,
    buttonColor: 'primary',
    spinnerColor: 'accent',
    fullWidth: false,
    disabled: false,
    mode: 'indeterminate',
  };

  runNuSMVCheck(plain_ltl: string): void {
    // const modelPath: string = '/Users/felixheld/Desktop/NuSMV-2.6.0-Darwin/test2.smv';
    this.btnOpts.active = true;
    const ltl: string = this.ltlService.getNuSMV(this.processVariables, plain_ltl, this.ucaData);

    this.electronService.remote.dialog
      .showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'NuSMV Model', extensions: ['smv'] }],
      })
      .then(result => {
        const modelPath: string = result.filePaths[0];

        if (modelPath?.length > 0 && ltl?.length > 0) this.doNuSMVCheck(modelPath, ltl);
        else {
          this.msg.info('Pleas select Model and LTL!');
          this.btnOpts.active = false;
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  async doNuSMVCheck(modelPath: string, ltl: string): Promise<void> {
    this.btnOpts.active = true;
    this.verificationService
      .doNuSMVCheck(modelPath, ltl, this.nuSmvMode, this.nuSmvPath)
      .then(() => {
        this.btnOpts.active = false;
      })
      .catch(() => {
        this.btnOpts.active = false;
      });
  }

  runSpinCheck(plain_ltl: string): void {
    // const modelPath: string = '/Users/felixheld/Desktop/NuSMV-2.6.0-Darwin/test2.smv';
    this.btnOpts1.active = true;
    const ltl: string = this.ltlService.getPromela(this.processVariables, plain_ltl, this.ucaData);

    this.electronService.remote.dialog
      .showOpenDialog({
        properties: ['openFile'],
        filters: [{ name: 'SPIN Model', extensions: ['pml'] }],
      })
      .then(result => {
        const modelPath: string = result.filePaths[0];

        if (modelPath?.length > 0 && ltl?.length > 0) this.doSpinCheck(modelPath, ltl);
        else {
          this.msg.info('Pleas select Model and LTL!');
          this.btnOpts1.active = false;
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  async doSpinCheck(modelPath: string, ltl: string): Promise<void> {
    this.btnOpts1.active = true;
    this.verificationService
      .doSpinCheck(modelPath, ltl, this.spinPath)
      .then(() => {
        this.btnOpts1.active = false;
      })
      .catch(() => {
        this.btnOpts1.active = false;
      });
  }

  ngAfterViewInit(): void {
    this.subscriptions.plusOne = this.table.rowExpanded
      .pipe(
        tap(unsafeControlAction => this.navigationService.setNewKeyValue(new KeyValuePair(unsafeControlAction.tableId)))
      )
      .subscribe();

    this.subscriptions.plusOne = this.table.rowCollapsed
      .pipe(
        tap(async unsafeControlAction => {
          this.editMode = false;
          await unsafeControlActionController.updateUnsafeControlAction({
            ...unsafeControlAction,
            formal: unsafeControlAction?.formal ?? '',
          });
          this.navigationService.setNewKeyValue(undefined);

          if (this.shouldCreateNew) {
            this.shouldCreateNew = false;
            // this.backendCreate(this.result);
          }
        })
      )
      .subscribe();

    this.subscriptions.plusOne = this.table.rowExpanded
      .pipe(
        tap(event => {
          this.parsedTerm = this.parseTerm(event?.formal);
        })
      )
      .subscribe();

    this.subscriptions.plusOne = this.table.rowDelete
      .pipe(
        tap(async event => {
          await unsafeControlActionController.removeUnsafeControlAction(event.row);
        })
      )
      .subscribe();

    // called if project changes but subcomponent (loss, uc etc.) did not change!
    this.subscriptions.plusOne = this.navigationService.activePoint
      .pipe(
        tap(() => {
          // saves active row on project change
          if (!!this.table?.expandedRow)
            unsafeControlActionController
              .updateUnsafeControlAction({
                ...this.table.expandedRow,
                formal: this.table?.expandedRow?.formal ?? '',
              })
              .catch((err: Error) => this.msg.info(err.message));

          // resubscribe to data of the new project
          this.dataSubscriptions.unsubscribe();
          this.initDataSubscriptions();
        })
      )
      .subscribe();
  }

  initDataSubscriptions(): void {
    this.dataSubscriptions.plusOne = unsafeControlActionController
      .getAll$(this.navigationService.currentPoint.projectId)
      .pipe(
        auditTime(UpdateTiming.REGUALR),
        tap(v => {
          this.ucaData = v;
          // this.ucaData.push(new UnsafeControlActionTableEntry(new UnsafeControlAction(), null, [], []));
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

    this.dataSubscriptions.plusOne = processVariableController
      .getAll$(this.navigationService.currentPoint.projectId)
      .pipe(
        auditTime(UpdateTiming.REGUALR),
        tap(v => {
          this.processVariables = v;
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    if (this.table.expandedRow)
      unsafeControlActionController.updateUnsafeControlAction({
        ...this.table.expandedRow,
        formal: this.table?.expandedRow?.formal ?? '',
      });
    this.dataSubscriptions.unsubscribe();
    this.subscriptions.unsubscribe();
  }

  columns: ColumnDefinition[] = [
    { label: 'ID', key: 'id', searchable: false },
    { label: 'STPA.UCA.NAME', key: 'name', searchable: true },
    { label: 'Description', key: 'description', searchable: true, hidden: true },
  ];

  helpDialogData: DialogData;

  getHelp(): void {
    this.msg.dialog({ data: this.helpDialogData });
  }

  constructor(
    readonly translate: TranslateService,
    private readonly navigationService: AppNavigationService,
    private readonly ltlService: LogicService,
    private readonly electronService: ElectronService,
    private readonly msg: MessageService,
    private readonly ngZone: NgZone,
    private readonly verificationService: VerificationService
  ) {
    translate
      .get(['STPA.UCA.NAME', 'STPA.UCAREFINEMENT.TITLE'])
      .pipe(
        tap(res => {
          this.columns = [
            { label: res['STPA.UCA.NAME'], key: 'name', searchable: true },
            { label: 'Description', key: 'description', searchable: true, hidden: true },
          ];
        })
      )
      .subscribe();

    /**
     * for help-dialog!
     */
    translate
      .get(['STPA.UCAREFINEMENT.HELPTITLE', 'STPA.UCAREFINEMENT.HELPBODYUCA'])
      .pipe(
        tap(res => {
          this.helpDialogData = {
            headline: res['STPA.UCAREFINEMENT.HELPTITLE'],
            text: res['STPA.UCAREFINEMENT.HELPBODYUCA'],
          };
        })
      )
      .subscribe();

    this.electronService.ipcRenderer.on(IpcKeys.NUSMV, (event, args) => {
      this.ngZone.run(() => {
        this.nuSmvPath = args;
      });
    });

    this.electronService.ipcRenderer.on(IpcKeys.SPIN, (event, args) => {
      this.ngZone.run(() => {
        this.spinPath = args;
      });
    });

    this.electronService.ipcRenderer
      .invoke(IpcKeys.STORE, StoreKeys.NUSMV)
      .then(s => {
        this.nuSmvPath = s;
      })
      .catch(err => this.msg.info(err.message));

    this.electronService.ipcRenderer
      .invoke(IpcKeys.STORE, StoreKeys.SPIN)
      .then(s => {
        this.spinPath = s;
      })
      .catch(err => this.msg.info(err.message));

    this.electronService.ipcRenderer.on(IpcKeys.IS_PROMELA, (event, args) => {
      this.ngZone.run(() => {
        this.isPromelaMode = args;
      });
    });

    this.electronService.ipcRenderer
      .invoke(IpcKeys.STORE, StoreKeys.IS_PROMELA_MODE)
      .then(s => {
        this.ngZone.run(() => {
          this.isPromelaMode = s;
        });
      })
      .catch();
  }
}
