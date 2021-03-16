import { State } from '@src-shared/Enums';
import { ControllerConstraint, ImplementationConstraint } from '@stpa/src/main/models';
import { Chip, ChipPrefix } from '@stpa/src/main/services/models/table-models/Chip';
import { ProjectDependentTableEntry } from '@stpa/src/main/services/models/table-models/common/ProjectDependentTableEntry';

export class ImplementationConstraintTableEntry extends ProjectDependentTableEntry implements ImplementationConstraint {
  readonly id: number;
  readonly projectId: string;
  readonly tableId: string;

  name: string;
  description: string;
  state: State;

  readonly lossScenarioId: number;

  readonly controllerConstraint: ControllerConstraint;
  readonly controllerConstraintChips: Chip[];

  constructor(
    implementationConstraint: ImplementationConstraint,
    controllerConstraint: ControllerConstraint,
    controllerConstraintChips: Chip[]
  ) {
    super(implementationConstraint);
    this.tableId = ChipPrefix.ImplementationConstraint + this.tableId;
    this.lossScenarioId = implementationConstraint.lossScenarioId;
    this.controllerConstraint = controllerConstraint;
    this.controllerConstraintChips = controllerConstraintChips;
  }
}
