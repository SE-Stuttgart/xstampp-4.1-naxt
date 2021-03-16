import { Box, ControlAction, Controller, Feedback, Input, Sensor } from '@src-shared/control-structure/models';
import { State } from '@src-shared/Enums';
import { Chip, ChipPrefix } from '@stpa/src/main/services/models/table-models/Chip';
import { HeadCategory, LossScenario, Reason, SubCategory, UnsafeControlAction } from '../../../../models';
import { ProjectDependentTableEntry } from '../common/ProjectDependentTableEntry';

export class LossScenarioTableEntry extends ProjectDependentTableEntry implements LossScenario {
  readonly id: number;
  readonly projectId: string;
  readonly tableId: string;

  name: string;
  description: string;
  state: State;

  readonly controlActionId: number;
  readonly ucaId: number;

  readonly headCategory: HeadCategory;
  readonly subCategory: SubCategory;

  controller1Id: number;
  controller2Id: number;

  description1: string;
  description2: string;
  description3: string;

  readonly controlAlgorithm: number; // unused?

  feedbackArrowId: number;
  inputArrowId: number;
  inputBoxId: string;
  sensorId: number;

  reason: Reason;

  readonly controlAction: ControlAction;
  readonly unsafeControlAction: UnsafeControlAction;

  readonly controllers: Controller[];
  readonly feedback: Feedback[];
  readonly inputs: Input[];
  readonly sensors: Sensor[];
  readonly boxes: Box[];

  readonly controlActionChips: Chip[];
  readonly unsafeControlActionChips: Chip[];

  constructor(
    lossScenario: LossScenario,
    controlAction: ControlAction,
    unsafeControlAction: UnsafeControlAction,
    controllers: Controller[],
    feedback: Feedback[],
    inputs: Input[],
    sensors: Sensor[],
    boxes: Box[],
    controlActionChips: Chip[],
    unsafeControlActionChips: Chip[]
  ) {
    super(lossScenario);
    this.tableId = ChipPrefix.LossScenario + this.tableId;
    this.controlActionId = lossScenario.controlActionId;
    this.ucaId = lossScenario.ucaId;
    this.headCategory = lossScenario.headCategory;
    this.subCategory = lossScenario.subCategory;
    this.name = lossScenario.name;
    this.description = lossScenario.description;
    this.state = lossScenario.state;
    this.controller1Id = lossScenario.controller1Id;
    this.controller2Id = lossScenario.controller2Id;
    this.description1 = lossScenario.description1;
    this.description2 = lossScenario.description2;
    this.description3 = lossScenario.description3;
    this.controlAlgorithm = lossScenario.controlAlgorithm;
    this.feedbackArrowId = lossScenario.feedbackArrowId;
    this.inputArrowId = lossScenario.inputArrowId;
    this.inputBoxId = lossScenario.inputBoxId;
    this.sensorId = lossScenario.sensorId;
    this.reason = lossScenario.reason;

    this.controlAction = controlAction;
    this.unsafeControlAction = unsafeControlAction;

    this.controllers = controllers;
    this.feedback = feedback;
    this.inputs = inputs;
    this.sensors = sensors;
    this.boxes = boxes;

    this.controlActionChips = controlActionChips;
    this.unsafeControlActionChips = unsafeControlActionChips;
  }
}

/**
 * Im alten System wird die ControlAction zum auswaehlen im Schritt2 einfach ignoriert und nur die
 * ControlAction, die beim erstellen eines LossScenarios benutzt...
 *
 * ___________________________________________________________________________________________________________
 *
 * "headCategory": "Failures related to the controller (for physical controllers)"
 *
 * "controller1Id": controller
 * "description1": "Description of the failure"
 *
 * ___________________________________________________________________________________________________________
 *
 * "headCategory": "Inadequate control algorithm",
 * "subCategory": "The specified control algorithm becomes inadequate over time due to changes or degradation"
 *
 * "controller1Id": controller
 *
 * "description1": "Description of the failure of the algorithm"
 * "description2": "Change / Degradation in the system"
 *
 * ___________________________________________________________________________________________________________
 *
 * "headCategory": "Inadequate control algorithm"
 * "subCategory": "The control algorithm is changed by an attacker"
 *
 * "controller1Id": controller
 *
 * "description1": "Description of the failure of the algorithm",
 * "description2": "Procedure of the attacker",
 * "description3": "Attacker",
 *
 * ___________________________________________________________________________________________________________
 *
 * headCategory": "Unsafe control input",
 * "subCategory": "UCA received from another controller (already addressed when considering UCAs from other controllers)",
 *
 * "controller1Id": source
 * "controller2Id": target
 *
 * ___________________________________________________________________________________________________________
 *
 * "headCategory": "Inadequate process model",
 * "subCategory": "Controller receives incorrect feedback/information ",
 *
 * "controller1Id": 2,
 *
 * "description2": "Reason description",
 * "reason": "AUSWAHL: possible reasons",
 *
 * ___________________________________________________________________________________________________________
 *
 * "headCategory": "Inadequate process model"
 * "subCategory": "Controller receives correct feedback/information but interprets it incorrectly or ignores it"
 *
 * "description1": "Wrong controller internal belief"
 * "description2": "Reason description"
 *
 * "reason": "AUSWAHL: possible reasons",
 *
 */
