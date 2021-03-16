import { AfterViewInit, Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  ProcessVariable,
  QuestionAndAnswer,
  questionAndAnswerController,
  systemComponentController,
  SystemComponentTableModel,
} from '@cast/index';
import { AppNavigationService, KeyValuePair, MessageService } from '@core/index';
import { TranslateService } from '@ngx-translate/core';
import { ColumnDefinition, ExpandTimings, FilterEntry, Subscriptions, TableComponent } from '@shared/index';
import { SystemComponentType } from '@src-shared/Enums';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'naxt-cast-system-components',
  templateUrl: './cast-system-components.component.html',
  styleUrls: ['./cast-system-components.component.scss'],
})
export class CastSystemComponentsComponent implements AfterViewInit, OnDestroy {
  @Input() link: ProcessVariable;
  private readonly subscriptions: Subscriptions = new Subscriptions();
  private readonly dataSubscriptions: Subscriptions = new Subscriptions();
  private firstLoad: boolean = false;
  @ViewChild(TableComponent) table: TableComponent<SystemComponentTableModel>;
  // @Input() systemComponentId: number = 1;
  menuList: FilterEntry[] = [
    { id: 1, name: SystemComponentType.Controller },
    { id: 2, name: SystemComponentType.Actuator },
    { id: 3, name: SystemComponentType.Sensor },
    { id: 4, name: SystemComponentType.ControlledProcess },
  ];
  getName(): string {
    let name: string;
    if (this.typeOfComponent === SystemComponentType.Controller) name = 'Controller';
    else if (this.typeOfComponent === SystemComponentType.Actuator) name = 'Actuator';
    else if (this.typeOfComponent === SystemComponentType.Sensor) name = 'Sensor';
    else if (this.typeOfComponent === SystemComponentType.ControlledProcess) name = 'ControlledProcess';

    return name;
  }
  typeOfComponent: SystemComponentType = SystemComponentType.Controller;
  textOfTextfield: string = '';
  systemComponentData: SystemComponentTableModel[] = [];
  private shouldCreateNew: boolean = false;
  private shouldFocus: boolean = false;
  ProcessVariableFormControl = new FormControl('');
  formControl: FormControl = new FormControl('', [Validators.required, Validators.minLength(4)]);
  ngAfterViewInit(): void {
    this.subscriptions.plusOne = this.table.rowExpanded
      .pipe(
        tap(systemComponent => {
          this.typeOfComponent = systemComponent.type;
          this.navigationService.setNewKeyValue(new KeyValuePair(systemComponent.tableId));
        })
      )
      .subscribe();

    this.subscriptions.plusOne = this.table.rowCollapsed
      .pipe(
        tap(systemComponent => {
          if (systemComponent.type === SystemComponentType.Controller) {
            systemComponentController
              .updateController(systemComponent)
              .catch((err: Error) => this.msg.info(err.message));
          } else if (systemComponent.type === SystemComponentType.Actuator) {
            systemComponentController.updateActuator(systemComponent).catch((err: Error) => this.msg.info(err.message));
          } else if (systemComponent.type === SystemComponentType.Sensor) {
            systemComponentController.updateSensor(systemComponent).catch((err: Error) => this.msg.info(err.message));
          } else {
            systemComponentController
              .updateControlledProcess(systemComponent)
              .catch((err: Error) => this.msg.info(err.message));
          }
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
          if (event.row.type === SystemComponentType.Controller) {
            systemComponentController.removeController(event.row).catch((err: Error) => this.msg.info(err.message));
          } else if (event.row.type === SystemComponentType.Actuator) {
            systemComponentController.removeActuator(event.row).catch((err: Error) => this.msg.info(err.message));
          } else if (event.row.type === SystemComponentType.Sensor) {
            systemComponentController.removeSensor(event.row).catch((err: Error) => this.msg.info(err.message));
          } else {
            systemComponentController
              .removeControlledProcess(event.row)
              .catch((err: Error) => this.msg.info(err.message));
          }
        })
      )
      .subscribe();

    // called if project changes but subcompinent (loss, uc etc.) did not change!
    this.subscriptions.plusOne = this.navigationService.activePoint
      .pipe(
        tap(() => {
          // saves active row on project change
          if (!!this.table?.expandedRow)
            if (this.table?.expandedRow.type === SystemComponentType.Controller) {
              systemComponentController
                .updateController(this.table?.expandedRow)
                .catch((err: Error) => this.msg.info(err.message));
            } else if (this.table?.expandedRow.type === SystemComponentType.Actuator) {
              systemComponentController
                .updateActuator(this.table?.expandedRow)
                .catch((err: Error) => this.msg.info(err.message));
            } else if (this.table?.expandedRow.type === SystemComponentType.Sensor) {
              systemComponentController
                .updateSensor(this.table?.expandedRow)
                .catch((err: Error) => this.msg.info(err.message));
            } else {
              systemComponentController
                .updateControlledProcess(this.table?.expandedRow)
                .catch((err: Error) => this.msg.info(err.message));
            }

          // resubscribse to data of the new project
          this.dataSubscriptions.unsubscribe();
          this.initDataSubscriptions();
        })
      )
      .subscribe();
  }
  initDataSubscriptions(): void {
    this.dataSubscriptions.plusOne = systemComponentController
      .getAllTableModel$(this.navigationService.currentPoint.projectId)
      .pipe(
        tap(v => {
          this.systemComponentData = v;

          // opens selecten row if needed
          if (this.firstLoad) {
            this.firstLoad = false;
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
  }
  createSystemComponentQuestionLink(question: string): void {
    const qna: QuestionAndAnswer = {
      ...new QuestionAndAnswer(),
      projectId: this.navigationService.currentPoint.projectId,
      name: question,
    };

    questionAndAnswerController.createQuestionAnswer(qna).then(qnaAnswer => {
      if (this.table.expandedRow.type === SystemComponentType.Controller) {
        questionAndAnswerController
          .createControllerLink(this.navigationService.currentPoint.projectId, this.table.expandedRow.id, qnaAnswer.id)
          .catch((err: Error) => this.msg.info(err.message));
      } else if (this.table.expandedRow.type === SystemComponentType.Sensor) {
        questionAndAnswerController
          .createSensorLink(this.navigationService.currentPoint.projectId, this.table.expandedRow.id, qnaAnswer.id)
          .catch((err: Error) => this.msg.info(err.message));
      } else if (this.table.expandedRow.type === SystemComponentType.Actuator) {
        questionAndAnswerController
          .createActuatorLink(this.navigationService.currentPoint.projectId, this.table.expandedRow.id, qnaAnswer.id)
          .catch((err: Error) => this.msg.info(err.message));
      } else if (this.table.expandedRow.type === SystemComponentType.ControlledProcess) {
        questionAndAnswerController
          .createControlledProcessLink(
            this.navigationService.currentPoint.projectId,
            this.table.expandedRow.id,
            qnaAnswer.id
          )
          .catch((err: Error) => this.msg.info(err.message));
      }
    });
  }

  ngOnDestroy(): void {
    if (this.table.expandedRow) {
      if (this.table.expandedRow.type === SystemComponentType.Controller) {
        systemComponentController
          .updateController(this.table.expandedRow)
          .catch((err: Error) => this.msg.info(err.message));
      } else if (this.table.expandedRow.type === SystemComponentType.Actuator) {
        systemComponentController
          .updateActuator(this.table.expandedRow)
          .catch((err: Error) => this.msg.info(err.message));
      } else if (this.table.expandedRow.type === SystemComponentType.Sensor) {
        systemComponentController
          .updateSensor(this.table.expandedRow)
          .catch((err: Error) => this.msg.info(err.message));
      } else {
        systemComponentController
          .updateControlledProcess(this.table.expandedRow)
          .catch((err: Error) => this.msg.info(err.message));
      }
    }
    this.dataSubscriptions.unsubscribe();
    this.subscriptions.unsubscribe();
  }

  private type: string;
  createSystemComponent(tableEntry: FilterEntry): void {
    this.type = tableEntry.name;
    if (
      this.shouldCreateNew ||
      this.systemComponentData.filter(systemComponent => !systemComponent.name || systemComponent.name.length <= 0)
        .length > 0
    ) {
      return;
    }

    if (!!this.table.expandedRow) {
      this.shouldCreateNew = true;
      this.table.collapseRows();
    } else this.backendCreate();
  }

  backendCreate(): void {
    this.shouldFocus = true;
    const projectId = this.navigationService.currentPoint.projectId;
    if (this.type === SystemComponentType.Controller) {
      systemComponentController.createController(projectId).catch((err: Error) => {
        this.msg.info(err.message);
        this.shouldFocus = false;
      });
    } else if (this.type === SystemComponentType.Actuator) {
      systemComponentController.createActuator(projectId).catch((err: Error) => {
        this.msg.info(err.message);
        this.shouldFocus = false;
      });
    } else if (this.type === SystemComponentType.Sensor) {
      systemComponentController.createSensor(projectId).catch((err: Error) => {
        this.msg.info(err.message);
        this.shouldFocus = false;
      });
    } else {
      systemComponentController.createControlledProcess(projectId).catch((err: Error) => {
        this.msg.info(err.message);
        this.shouldFocus = false;
      });
    }
  }
  readonly: boolean = true;

  editRow: number = -1;
  isEditRow(i: number): boolean {
    return this.editRow === i;
  }

  editPv(link: ProcessVariable, rowNumber: number): void {
    if (this.editRow === -1) {
      this.editRow = rowNumber;
    } else if (this.editRow === rowNumber) {
      systemComponentController
        .updateProcessVariable(link)
        .then(() => {
          this.editRow = -1;
        })
        .catch((err: Error) => {
          this.msg.info(err.message);
        });
    }
  }

  deletePv(link: ProcessVariable): void {
    systemComponentController.removeProcessVariable(link).catch((err: Error) => {
      this.msg.info(err.message);
    });
  }
  columns: ColumnDefinition[] = [
    { label: 'ID', key: 'id', searchable: false },
    { label: 'CAST.SYSTEMCOMPONENTS.NAME', key: 'name', searchable: true },
    { label: 'CAST.SYSTEMCOMPONENTS.TYPE', key: 'type', searchable: true },
    { label: 'Description', key: 'description', searchable: true, hidden: true },
  ];
  constructor(
    translate: TranslateService,
    private readonly navigationService: AppNavigationService,
    private readonly msg: MessageService
  ) {
    translate
      .get(['CAST.SYSTEMCOMPONENTS.NAME', 'CAST.SYSTEMCOMPONENTS.TITLE', 'CAST.SYSTEMCOMPONENTS.TYPE'])
      .pipe(
        tap(res => {
          this.columns = [
            { label: res['CAST.SYSTEMCOMPONENTS.NAME'], key: 'name', searchable: true },
            { label: res['CAST.SYSTEMCOMPONENTS.TYPE'], key: 'type', searchable: true },
            { label: 'Description', key: 'description', searchable: true, hidden: true },
          ];
        })
      )
      .subscribe();
  }
  processvariables: ProcessVariable[] = [];
  addItemToList(event: Event, processVariableName: string): void {
    event.stopPropagation();

    if (!processVariableName || processVariableName?.length <= 0) return;

    systemComponentController.updateController(this.table.expandedRow).then(() =>
      systemComponentController
        .createProcessVariable({
          ...new ProcessVariable(),
          controllerId: this.table.expandedRow.id,
          name: processVariableName,
          projectId: this.navigationService.currentPoint.projectId,
        })
        .catch((err: Error) => {
          this.msg.info(err.message);
        })
    );
  }
}
