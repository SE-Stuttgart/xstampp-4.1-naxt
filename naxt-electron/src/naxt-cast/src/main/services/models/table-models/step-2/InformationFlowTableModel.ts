import { ChipPrefix } from '@cast/src/main/services/models/Chip';
import { ControlAction, Feedback, Input, Output } from '@src-shared/control-structure/models';
import { InformationFlowType, State } from '@src-shared/Enums';
import { TableId } from '@src-shared/Interfaces';

export type InformationFlow = ControlAction & Feedback & Input & Output;
export class InformationFlowTableModel implements InformationFlow, TableId {
  readonly type: InformationFlowType;

  readonly id: number;
  readonly tableId: string;
  readonly projectId: string;

  name: string;
  description: string;
  state: State;

  readonly arrowId: string;

  constructor(informationFlow: InformationFlow, informationFlowType: InformationFlowType) {
    this.id = informationFlow.id;
    this.projectId = informationFlow.projectId;

    this.name = informationFlow.name;
    this.description = informationFlow.description;
    this.state = informationFlow.state;

    this.type = informationFlowType;
    this.arrowId = informationFlow.arrowId;
  }
}

export class ControlActionTableModel extends InformationFlowTableModel {
  readonly tableId: string;
  constructor(controlAction: ControlAction) {
    super(controlAction, InformationFlowType.ControlAction);
    this.tableId = ChipPrefix.ControlAction + this.id;
  }
}

export class FeedbackTableModel extends InformationFlowTableModel {
  readonly tableId: string;
  constructor(feedback: Feedback) {
    super(feedback, InformationFlowType.Feedback);
    this.tableId = ChipPrefix.Feedback + this.id;
  }
}

export class InputTableModel extends InformationFlowTableModel {
  readonly tableId: string;
  constructor(input: Input) {
    super(input, InformationFlowType.Input);
    this.tableId = ChipPrefix.Input + this.id;
  }
}

export class OutputTableModel extends InformationFlowTableModel {
  readonly tableId: string;
  constructor(output: Output) {
    super(output, InformationFlowType.Output);
    this.tableId = ChipPrefix.Output + this.id;
  }
}
