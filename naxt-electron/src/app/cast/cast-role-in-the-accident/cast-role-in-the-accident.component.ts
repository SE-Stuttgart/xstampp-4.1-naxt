import { AfterViewInit, Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ColumnDefinition, ExpandTimings, Subscriptions, TableComponent, UpdateTiming } from '@shared/index';
import { auditTime, tap } from 'rxjs/operators';
import { AppNavigationService, KeyValuePair, MessageService } from '@core/index';
import {
  questionAndAnswerController,
  roleInTheAccidentController,
  RoleInTheAccidentTableModel,
  systemComponentController,
} from '@cast/index';
import { SystemComponentType } from '@src-shared/Enums';
import { ProcessVariable, QuestionAndAnswer } from '@cast/src/main/models';
import { ControllerTableModel } from '@cast/src/main/services/models/table-models/step-2/SystemComponentTableModel';

@Component({
  selector: 'naxt-cast-role-in-the-accident',
  templateUrl: './cast-role-in-the-accident.component.html',
  styleUrls: ['./cast-role-in-the-accident.component.scss'],
})
export class CastRoleInTheAccidentComponent implements AfterViewInit, OnDestroy {
  private readonly subscriptions: Subscriptions = new Subscriptions();
  private readonly dataSubscriptions: Subscriptions = new Subscriptions();
  @ViewChild(TableComponent) table: TableComponent<RoleInTheAccidentTableModel>;
  @Input() roleInTheAccidentId: number = 1;
  @Input() controller: boolean = false;
  roleInTheAccidentData: RoleInTheAccidentTableModel[] = [];
  private shouldFocus: boolean = false;
  private firstLoad: boolean = false;
  listOfProcessVariables: ProcessVariable[] = [];
  controllerTableModelProcessVariable: ControllerTableModel[] = [];
  textOfTextfield: string = '';
  ngAfterViewInit(): void {
    this.subscriptions.plusOne = this.table.rowExpanded
      .pipe(
        tap((roleInTheAccident: RoleInTheAccidentTableModel) => {
          this.navigationService.setNewKeyValue(new KeyValuePair(roleInTheAccident.tableId));
        })
      )
      .subscribe();

    this.subscriptions.plusOne = this.table.rowCollapsed
      .pipe(
        tap(roleInTheAccident => {
          roleInTheAccidentController.update(roleInTheAccident).catch((err: Error) => this.msg.info(err.message));
          if (roleInTheAccident.componentType === SystemComponentType.Controller) {
            const processVariablesList = roleInTheAccident.component as ControllerTableModel;
            processVariablesList.processVariables.forEach(element => {
              systemComponentController.updateProcessVariable(element);
            });
          }
          this.navigationService.setNewKeyValue(undefined);
        })
      )
      .subscribe();

    this.subscriptions.plusOne = this.navigationService.activePoint
      .pipe(
        tap(() => {
          // saves active row on project change
          if (!!this.table?.expandedRow)
            roleInTheAccidentController
              .update(this.table.expandedRow)
              .catch((err: Error) => this.msg.info(err.message));

          // resubscribse to data of the new project
          this.dataSubscriptions.unsubscribe();
          this.initDataSubscriptions();
        })
      )
      .subscribe();
  }
  initDataSubscriptions(): void {
    this.dataSubscriptions.plusOne = roleInTheAccidentController
      .getAllTableModels$(this.navigationService.currentPoint.projectId)
      .pipe(
        auditTime(UpdateTiming.REGUALR),
        tap(v => {
          this.roleInTheAccidentData = v;

          // opens selecten row if needed
          if (this.firstLoad) {
            this.firstLoad = false;
            if (this.table?.expandedRow?.tableId !== this.navigationService.currentPoint.keyValuePair?.value)
              setTimeout(() => {
                this.table.activateRowByPair(this.navigationService.currentPoint.keyValuePair);
              }, ExpandTimings.REGULAR);
          }
        })
      )
      .subscribe();
  }
  createRoleInTheAccidentQuestionLink(question: string): void {
    const qna: QuestionAndAnswer = {
      ...new QuestionAndAnswer(),
      projectId: this.navigationService.currentPoint.projectId,
      name: question,
    };

    questionAndAnswerController.createQuestionAnswer(qna).then(qnaAnswer => {
      questionAndAnswerController
        .createRoleInTheAccidentLink(
          this.navigationService.currentPoint.projectId,
          this.table.expandedRow.id,
          qnaAnswer.id
        )
        .catch((err: Error) => this.msg.info(err.message));
    });
  }
  ngOnDestroy(): void {
    if (this.table.expandedRow) {
      roleInTheAccidentController.update(this.table.expandedRow);
      if (this.table.expandedRow.componentType === SystemComponentType.Controller) {
        const processVariablesList = this.table.expandedRow.component as ControllerTableModel;
        processVariablesList.processVariables.forEach(element => {
          systemComponentController.updateProcessVariable(element);
        });
      }
    }

    this.dataSubscriptions.unsubscribe();
    this.subscriptions.unsubscribe();
  }

  columns: ColumnDefinition[] = [
    { label: 'ID', key: 'id', searchable: false },
    { label: 'CAST.ROLEINTHEACCIDENT.NAME', key: 'name', searchable: true },
    { label: 'Description', key: 'description', searchable: true, hidden: true },
    {
      label: 'CAST.ROLEINTHEACCIDENT.COMPONENTTYPE',
      key: 'componentType',
      searchable: true,
      hidden: true,
      preSet: true,
      value: 'controller',
    },
  ];
  constructor(
    translate: TranslateService,
    private readonly navigationService: AppNavigationService,
    private readonly msg: MessageService
  ) {
    translate
      .get(['CAST.ROLEINTHEACCIDENT.NAME', 'CAST.ROLEINTHEACCIDENT.TITLE', 'CAST.ROLEINTHEACCIDENT.COMPONENTTYPE'])
      .pipe(
        tap(res => {
          this.columns = [
            { label: res['CAST.ROLEINTHEACCIDENT.NAME'], key: 'name', searchable: true },
            { label: 'Description', key: 'description', searchable: true, hidden: true },
            {
              label: res['CAST.ROLEINTHEACCIDENT.COMPONENTTYPE'],
              key: 'componentType',
              searchable: true,
              hidden: true,
              preSet: true,
              value: 'controller',
            },
            { label: 'name of the component', key: 'controllerName', searchable: true },
          ];
        })
      )
      .subscribe();
  }
}
