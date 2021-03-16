import { ControlAction, Feedback, Input, Output } from '@src-shared/control-structure/models';
import { InformationFlowType, State } from '@src-shared/Enums';
import { ChipPrefix } from '@stpa/src/main/services/models/table-models/Chip';
import { ProjectDependentTableEntry } from '@stpa/src/main/services/models/table-models/common/ProjectDependentTableEntry';

export type InformationFlow = ControlAction & Feedback & Input & Output;
export class InformationFlowTableEntry extends ProjectDependentTableEntry implements InformationFlow {
  readonly tableId: string;
  readonly type: InformationFlowType;

  readonly id: number;
  readonly projectId: string;

  name: string;
  description: string;
  state: State;

  readonly arrowId: string;

  constructor(informationFlow: InformationFlow, informationFlowType: InformationFlowType) {
    super(informationFlow);
    this.type = informationFlowType;
    this.arrowId = informationFlow.arrowId;
  }
}

export class ControlActionTableEntry extends InformationFlowTableEntry {
  readonly tableId: string;
  constructor(informationFlow: InformationFlow) {
    super(informationFlow, InformationFlowType.ControlAction);
    this.tableId = ChipPrefix.ControlAction + this.tableId;
  }
}

export class FeedbackTableEntry extends InformationFlowTableEntry {
  readonly tableId: string;
  constructor(informationFlow: InformationFlow) {
    super(informationFlow, InformationFlowType.Feedback);
    this.tableId = ChipPrefix.Feedback + this.tableId;
  }
}

export class InputTableEntry extends InformationFlowTableEntry {
  readonly tableId: string;
  constructor(informationFlow: InformationFlow) {
    super(informationFlow, InformationFlowType.Input);
    this.tableId = ChipPrefix.Input + this.tableId;
  }
}

export class OutputTableEntry extends InformationFlowTableEntry {
  readonly tableId: string;
  constructor(informationFlow: InformationFlow) {
    super(informationFlow, InformationFlowType.Output);
    this.tableId = ChipPrefix.Output + this.tableId;
  }
}
