import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ChipPrefix, questionAndAnswerController, QuestionAndAnswerTableModel } from '@cast/index';
import { TableModel } from '@cast/src/main/services/models/table-models/common/TableModel';
import { Chip } from '@shared/controls';
import { Subscriptions } from '@shared/utils/subscriptions';
import { distinctUntilChanged, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { pausable, PausableObservable } from '@shared/utils/PausableObservable';

export interface QuestionData {
  question: string;
  answer?: string;
  componentId: number;
  state: string;
}

@Component({
  selector: 'naxt-question-control',
  templateUrl: './question-control.component.html',
  styleUrls: ['./question-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionControlComponent implements OnInit, OnDestroy {
  @Input() value: string;
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  $1: PausableObservable<QuestionAndAnswerTableModel[]>;
  //@Input() questionArray: QuestionAndAnswerTableModel[] = [];
  questionArray: [QuestionAndAnswerTableModel[], string[]] = [[], []];
  private _add: [TableModel, string, string];

  @Input() set add(v: [TableModel, string, string]) {
    // stop if it is the same !
    if (JSON.stringify(v) === JSON.stringify(this._add)) return;

    // unsubscribe if needed
    this.questionSubscriptions.unsubscribe();
    this._add = v;
    this.questionArray = [[], []];

    const [tableModel, tableModelComponentType, tableModelId] = v;
    const [questionAndAnswerTableModels, linkedQuestionIds] = this.questionArray;

    this.$1 = questionAndAnswerController.getAll$(tableModel.projectId).pipe(
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      tap(questionAndAnswerTableModels => {
        this.questionArray[0] = questionAndAnswerTableModels;
        this.isLoading = false;
        this.cdr.markForCheck();
        //     questionAndAnswerTableModels.forEach(questionAndAnswerTableModel => {
        //       const linkedChips = questionAndAnswerTableModel.componentChips
        //         .filter(chip => chip.selected)
        //         .filter(chip => chip.id === tableModel.id)
        //         .filter(hasComponentType(tableModelComponentType));
        //       if (linkedChips) linkedQuestionIds.push(questionAndAnswerTableModel.id);

        //       console.log();
        //       console.log();
        //       console.log(tableModel);
        //       console.log(linkedChips);
        //       console.log(linkedQuestionIds);
        //     });
      }),
      pausable()
    ) as PausableObservable<QuestionAndAnswerTableModel[]>;
    this.questionSubscriptions.plusOne = this.$1.subscribe();
  }

  get add(): [TableModel, string, string] {
    return this._add;
  }

  @Output() addEmit: EventEmitter<string> = new EventEmitter<string>();
  panelOpenState: boolean = false;
  name: string;
  labelQuestion: string = '';
  labelAnswer: string = 'answer';
  questionDataObject: QuestionData = { answer: '', question: '', componentId: 1, state: '' };
  private readonly subscriptions: Subscriptions = new Subscriptions();
  private readonly questionSubscriptions: Subscriptions = new Subscriptions();
  questionFormControl: FormControl = new FormControl('');

  constructor(
    private router: Router,
    private readonly translate: TranslateService,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.labelQuestion = translate.instant('CAST.QUESTION');
  }

  isExpansionDisabled(): string {
    if (this.panelOpenState) {
      return 'disabled-pointer';
    }
    return '';
  }

  onChange(input: HTMLInputElement, newValue: string): void {
    event.stopPropagation();
    if (!newValue || newValue?.trim().length <= 0) return;
    this.questionFormControl.patchValue('');
    this.addEmit.emit(newValue);
    //this.valueChange.emit(newValue);
  }

  ngOnInit(): void {
    this.subscriptions.plusOne = this.questionFormControl.valueChanges
      .pipe(
        tap(v => {
          this.panelOpenState = true;
          this.value = v;
        })
      )
      .subscribe();
  }

  onFocus(event): void {
    event.stopPropagation();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
    this.questionSubscriptions.unsubscribe();
  }

  updateChiplist(question: QuestionAndAnswerTableModel, event: Chip[]): void {
    question.componentChips = event.map(chip => ({
      ...chip,
      id: chip.id as string,
    }));
  }

  includesQuestionId(question: QuestionAndAnswerTableModel): boolean {
    let tag: boolean = false;
    if (this.add[1] === 'Controller') {
      question.componentChips.forEach(element => {
        if (element.selected && element.id === this.add[2] && element.label.startsWith(ChipPrefix.Controller)) {
          tag = element.selected;
        }
      });
      return tag;
    }
    if (this.add[1] === 'Actuator') {
      question.componentChips.forEach(element => {
        if (element.selected && element.id === this.add[2] && element.label.startsWith(ChipPrefix.Actuator)) {
          tag = element.selected;
        }
      });
      return tag;
    }

    if (this.add[1] === 'Sensor') {
      question.componentChips.forEach(element => {
        if (element.selected && element.id === this.add[2] && element.label.startsWith(ChipPrefix.Sensor)) {
          tag = element.selected;
        }
      });
      return tag;
    }
    if (this.add[1] === 'ControlledProcess') {
      question.componentChips.forEach(element => {
        if (element.selected && element.id === this.add[2] && element.label.startsWith(ChipPrefix.ControlledProcess)) {
          tag = element.selected;
        }
      });
      return tag;
    }
    if (this.add[1] === 'ControlAction') {
      question.componentChips.forEach(element => {
        if (element.selected && element.id === this.add[2] && element.label.startsWith(ChipPrefix.ControlAction)) {
          tag = element.selected;
        }
      });
      return tag;
    }
    if (this.add[1] === 'Feedback') {
      question.componentChips.forEach(element => {
        if (element.selected && element.id === this.add[2] && element.label.startsWith(ChipPrefix.Feedback)) {
          tag = element.selected;
        }
      });
      return tag;
    }
    if (this.add[1] === 'Input') {
      question.componentChips.forEach(element => {
        if (element.selected && element.id === this.add[2] && element.label.startsWith(ChipPrefix.Input)) {
          tag = element.selected;
        }
      });
      return tag;
    }
    if (this.add[1] === 'Output') {
      question.componentChips.forEach(element => {
        if (element.selected && element.id === this.add[2] && element.label.startsWith(ChipPrefix.Output)) {
          tag = element.selected;
        }
      });
      return tag;
    } else {
      question.componentChips.forEach(element => {
        if (element.selected && element.id === this.add[2]) {
          tag = element.selected;
        }
      });
    }
    return tag;
  }

  goToQuestionAndAnswerComponent(): void {
    this.router.navigate(['/cast/cast_id/questions-and-answers']);
  }

  isLoading: boolean = false;
  async click(question: QuestionAndAnswerTableModel): Promise<void> {
    const [tableModel, tableModelComponentType] = this.add;
    const includesTableId = !this.includesQuestionId(question);
    const projectId = question.projectId;

    if (this.isLoading) return;

    this.$1.pause();
    this.isLoading = true;
    switch (tableModelComponentType) {
      case 'Hazard':
        if (includesTableId) await questionAndAnswerController.createHazardLink(projectId, tableModel.id, question.id);
        else await questionAndAnswerController.removeLink(projectId, tableModel.id, question.id);
        break;
      case 'Constraint':
        if (includesTableId)
          await questionAndAnswerController.createConstraintLink(projectId, tableModel.id, question.id);
        else await questionAndAnswerController.removeLink(projectId, tableModel.id, question.id);
        break;

      case 'Event':
        if (includesTableId) await questionAndAnswerController.createEventLink(projectId, tableModel.id, question.id);
        else await questionAndAnswerController.removeLink(projectId, tableModel.id, question.id);
        break;

      case 'Controller':
        if (includesTableId)
          await questionAndAnswerController.createControllerLink(projectId, Number(tableModel.id), question.id);
        else await questionAndAnswerController.removeLinkForController(projectId, tableModel.id, question.id);
        break;

      case 'Actuator':
        if (includesTableId)
          await questionAndAnswerController.createActuatorLink(projectId, Number(tableModel.id), question.id);
        else await questionAndAnswerController.removeLinkForActuator(projectId, tableModel.id, question.id);
        break;

      case 'Sensor':
        if (includesTableId)
          await questionAndAnswerController.createSensorLink(projectId, Number(tableModel.id), question.id);
        else await questionAndAnswerController.removeLinkForSensor(projectId, tableModel.id, question.id);
        break;

      case 'ControlledProcess':
        if (includesTableId)
          await questionAndAnswerController.createControlledProcessLink(projectId, Number(tableModel.id), question.id);
        else await questionAndAnswerController.removeLinkForControlledProcess(projectId, tableModel.id, question.id);
        break;

      case 'Input':
        if (includesTableId)
          await questionAndAnswerController.createInputLink(projectId, Number(tableModel.id), question.id);
        else await questionAndAnswerController.removeLinkForInput(projectId, tableModel.id, question.id);
        break;

      case 'Output':
        if (includesTableId)
          await questionAndAnswerController.createOutputLink(projectId, Number(tableModel.id), question.id);
        else await questionAndAnswerController.removeLinkForOutput(projectId, tableModel.id, question.id);
        break;

      case 'Feedback':
        if (includesTableId)
          await questionAndAnswerController.createFeedbackLink(projectId, Number(tableModel.id), question.id);
        else await questionAndAnswerController.removeLinkForFeedback(projectId, tableModel.id, question.id);
        break;

      case 'ControlAction':
        if (includesTableId)
          await questionAndAnswerController.createControlActionLink(projectId, Number(tableModel.id), question.id);
        else await questionAndAnswerController.removeLinkForControlAction(projectId, tableModel.id, question.id);
        break;

      case 'Responsibility':
        if (includesTableId)
          await questionAndAnswerController.createResponsibilityLink(projectId, tableModel.id, question.id);
        else await questionAndAnswerController.removeLink(projectId, tableModel.id, question.id);
        break;

      case 'RoleInTheAccident':
        if (includesTableId)
          await questionAndAnswerController.createRoleInTheAccidentLink(projectId, tableModel.id, question.id);
        else await questionAndAnswerController.removeLink(projectId, tableModel.id, question.id);
        break;

      case 'CAD':
        if (includesTableId)
          await questionAndAnswerController.createChangesAndDynamicsOverTimeLink(projectId, tableModel.id, question.id);
        else await questionAndAnswerController.removeLink(projectId, tableModel.id, question.id);
        break;

      case 'CAC':
        if (includesTableId)
          await questionAndAnswerController.createCommunicationAndCoordinationLink(
            projectId,
            tableModel.id,
            question.id
          );
        else await questionAndAnswerController.removeLink(projectId, tableModel.id, question.id);
        break;

      case 'IAE':
        if (includesTableId)
          await questionAndAnswerController.createInternalAndExternalEconomicsLink(
            projectId,
            tableModel.id,
            question.id
          );
        else await questionAndAnswerController.removeLink(projectId, tableModel.id, question.id);
        break;

      case 'SC':
        if (includesTableId)
          await questionAndAnswerController.createSafetyCultureLink(projectId, tableModel.id, question.id);
        else await questionAndAnswerController.removeLink(projectId, tableModel.id, question.id);
        break;

      case 'SIS':
        if (includesTableId)
          await questionAndAnswerController.createSafetyInformationSystemLink(projectId, tableModel.id, question.id);
        else await questionAndAnswerController.removeLink(projectId, tableModel.id, question.id);
        break;

      case 'SMS':
        if (includesTableId)
          await questionAndAnswerController.createSafetyManagementSystemLink(projectId, tableModel.id, question.id);
        else await questionAndAnswerController.removeLink(projectId, tableModel.id, question.id);
        break;
    }
    this.$1.resume();
  }
}

function hasComponentType(componentType: string): (chip?: Chip) => boolean {
  let chipPrefix: ChipPrefix;
  switch (componentType) {
    case 'Actuator':
      chipPrefix = ChipPrefix.Actuator;
      break;
    case 'ControlledProcess':
      chipPrefix = ChipPrefix.ControlledProcess;
      break;
    case 'Controller':
      chipPrefix = ChipPrefix.Controller;
      break;
    case 'Sensor':
      chipPrefix = ChipPrefix.Sensor;
      break;
    case 'ControlAction':
      chipPrefix = ChipPrefix.ControlAction;
      break;
    case 'Feedback':
      chipPrefix = ChipPrefix.Feedback;
      break;
    case 'Input':
      chipPrefix = ChipPrefix.Input;
      break;
    case 'Output':
      chipPrefix = ChipPrefix.Output;
      break;
    default:
      return () => true;
  }
  return (chip: Chip) => chip.label.startsWith(chipPrefix);
}
