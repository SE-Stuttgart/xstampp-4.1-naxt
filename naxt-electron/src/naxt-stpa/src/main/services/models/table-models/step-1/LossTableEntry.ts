import { State } from '@src-shared/Enums';
import { Loss } from '@stpa/src/main/models';
import { ProjectDependentTableEntry } from '@stpa/src/main/services/models/table-models/common/ProjectDependentTableEntry';
import { Chip, ChipPrefix } from '../Chip';

export class LossTableEntry extends ProjectDependentTableEntry implements Loss {
  readonly id: number;
  readonly projectId: string;
  readonly tableId: string;

  name: string;
  description: string;
  state: State;

  readonly hazardChips: Chip[];

  constructor(loss: Loss, hazardChips: Chip[]) {
    super(loss);
    this.tableId = ChipPrefix.Loss + this.tableId;
    this.hazardChips = hazardChips;
  }
}
