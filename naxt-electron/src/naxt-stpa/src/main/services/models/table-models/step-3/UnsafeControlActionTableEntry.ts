import { State } from '@src-shared/Enums';
import { UnsafeControlAction } from '@stpa/src/main/models';
import { UCACategory } from '@stpa/src/main/models/step-3/UnsafeControlAction';
import { EntityDependentTableEntry } from '@stpa/src/main/services/models/table-models/common/EntityDependentTableEntry';
import { Chip, ChipPrefix } from '../Chip';

export class UnsafeControlActionTableEntry extends EntityDependentTableEntry implements UnsafeControlAction {
  readonly id: number;
  readonly parentId: number;
  readonly projectId: string;
  readonly tableId: string;

  name: string;
  description: string;
  state: State;

  category: UCACategory;

  formal: string;
  formalDescription: string;

  readonly controlActionChips: Chip[];

  readonly hazardChips: Chip[];
  readonly subHazardChips: Chip[];

  constructor(
    unsafeControlAction: UnsafeControlAction,
    controlActionChips: Chip[],
    hazardChips: Chip[],
    subHazardChips: Chip[]
  ) {
    super(unsafeControlAction);
    this.tableId = ChipPrefix.UnsafeControlAction + this.tableId;
    this.category = unsafeControlAction.category;
    this.controlActionChips = controlActionChips;

    this.formal = unsafeControlAction.formal;
    this.formalDescription = unsafeControlAction.formalDescription;

    this.hazardChips = hazardChips;
    this.subHazardChips = subHazardChips;
  }
}
