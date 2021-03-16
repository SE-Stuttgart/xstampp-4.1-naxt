import { State } from '@src-shared/Enums';
import { Responsibility } from '@stpa/src/main/models';
import { ProjectDependentTableEntry } from '@stpa/src/main/services/models/table-models/common/ProjectDependentTableEntry';
import { Chip, ChipPrefix } from '../Chip';

export class ResponsibilityTableEntry extends ProjectDependentTableEntry implements Responsibility {
  readonly id: number;
  readonly projectId: string;
  readonly tableId: string;

  name: string;
  description: string;
  state: State;

  readonly controllerId: number;
  readonly controllerProjectId: string;

  readonly controllerChips: Chip[];
  readonly systemConstraintChips: Chip[];
  readonly subSystemConstraintChips: Chip[];

  constructor(
    responsibility: Responsibility,
    controllerChips: Chip[],
    systemConstraintChips: Chip[],
    subSystemConstraintChips: Chip[]
  ) {
    super(responsibility);
    this.tableId = ChipPrefix.Responsibility + this.tableId;
    this.controllerId = responsibility.controllerId;
    this.controllerProjectId = responsibility.controllerProjectId;
    this.controllerChips = controllerChips;
    this.systemConstraintChips = systemConstraintChips;
    this.subSystemConstraintChips = subSystemConstraintChips;
  }
}
