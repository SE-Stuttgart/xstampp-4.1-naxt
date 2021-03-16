import { State } from '@src-shared/Enums';
import { SubHazard } from '@stpa/src/main/models';
import { EntityDependentTableEntry } from '@stpa/src/main/services/models/table-models/common/EntityDependentTableEntry';
import { Chip, ChipPrefix } from '../Chip';

export class SubHazardTableEntry extends EntityDependentTableEntry implements SubHazard {
  readonly id: number;
  readonly parentId: number;
  readonly projectId: string;
  readonly tableId: string;

  name: string;
  description: string;
  state: State;

  readonly hazardChips: Chip[];
  readonly subSystemConstraintChips: Chip[];
  readonly unsafeControlActionChips: Chip[];

  constructor(subHazard: SubHazard, hazardChips: Chip[], subSystemConstraint: Chip[], ucaLinks: Chip[]) {
    super(subHazard);
    this.tableId = ChipPrefix.SubHazard + this.tableId;
    this.hazardChips = hazardChips;
    this.subSystemConstraintChips = subSystemConstraint;
    this.unsafeControlActionChips = ucaLinks;
  }
}
