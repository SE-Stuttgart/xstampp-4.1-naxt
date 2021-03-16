import { State } from '@src-shared/Enums';
import { Hazard } from '@stpa/src/main/models';
import { ProjectDependentTableEntry } from '@stpa/src/main/services/models/table-models/common/ProjectDependentTableEntry';
import { Chip, ChipPrefix } from '../Chip';

export class HazardTableEntry extends ProjectDependentTableEntry implements Hazard {
  readonly id: number;
  readonly projectId: string;
  readonly tableId: string;

  name: string;
  description: string;
  state: State;

  readonly subHazardChips: Chip[];
  readonly lossChips: Chip[];
  readonly systemConstraintChips: Chip[];
  readonly unsafeControlActionChips: Chip[];

  constructor(
    hazard: Hazard,
    subHazardChips: Chip[],
    lossChips: Chip[],
    systemConstraintChips: Chip[],
    unsafeControlActionChips: Chip[]
  ) {
    super(hazard);
    this.tableId = ChipPrefix.Hazard + this.tableId;
    this.subHazardChips = subHazardChips;
    this.lossChips = lossChips;
    this.systemConstraintChips = systemConstraintChips;
    this.unsafeControlActionChips = unsafeControlActionChips;
  }
}
