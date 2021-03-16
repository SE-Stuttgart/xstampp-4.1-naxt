import { State } from '@src-shared/Enums';
import { SubSystemConstraint } from '@stpa/src/main/models';
import { Chip, ChipPrefix } from '@stpa/src/main/services/models/table-models/Chip';
import { EntityDependentTableEntry } from '@stpa/src/main/services/models/table-models/common/EntityDependentTableEntry';

export class SubSystemConstraintTableEntry extends EntityDependentTableEntry implements SubSystemConstraint {
  readonly id: number;
  readonly parentId: number;
  readonly projectId: string;
  readonly tableId: string;

  name: string;
  description: string;
  state: State;

  hazardId: number;
  subHazardId: number;

  readonly systemConstraintChips: Chip[];
  readonly subHazardChips: Chip[];

  constructor(subSystemConstraint: SubSystemConstraint, systemConstraintChips: Chip[], subHazardChips: Chip[]) {
    super(subSystemConstraint);
    this.tableId = ChipPrefix.SubSystemConstraint + this.tableId;
    this.hazardId = subSystemConstraint.hazardId;
    this.subHazardId = subSystemConstraint.subHazardId;
    this.systemConstraintChips = systemConstraintChips;
    this.subHazardChips = subHazardChips;
  }
}
