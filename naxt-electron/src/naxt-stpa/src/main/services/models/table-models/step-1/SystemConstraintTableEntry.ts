import { State } from '@src-shared/Enums';
import { SystemConstraint } from '@stpa/src/main/models';
import { ProjectDependentTableEntry } from '@stpa/src/main/services/models/table-models/common/ProjectDependentTableEntry';
import { Chip, ChipPrefix } from '../Chip';

export class SystemConstraintTableEntry extends ProjectDependentTableEntry implements SystemConstraint {
  readonly id: number;
  readonly projectId: string;
  readonly tableId: string;

  name: string;
  description: string;
  state: State;

  readonly hazardChips: Chip[];

  constructor(systemConstraint: SystemConstraint, hazardChips: Chip[]) {
    super(systemConstraint);
    this.tableId = ChipPrefix.SystemConstraint + this.tableId;
    this.hazardChips = hazardChips;
  }
}
