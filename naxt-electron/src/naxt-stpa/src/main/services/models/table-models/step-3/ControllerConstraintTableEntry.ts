import { State } from '@src-shared/Enums';
import { ControllerConstraint, UnsafeControlAction } from '@stpa/src/main/models';
import { Chip, ChipPrefix } from '@stpa/src/main/services/models/table-models/Chip';
import { EntityDependentTableEntry } from '@stpa/src/main/services/models/table-models/common/EntityDependentTableEntry';

export class ControllerConstraintTableEntry extends EntityDependentTableEntry implements ControllerConstraint {
  readonly id: number;
  readonly parentId: number;
  readonly projectId: string;
  readonly tableId: string;

  name: string;
  description: string;
  state: State;

  readonly unsafeControlAction: UnsafeControlAction;
  readonly unsafeControlActionName: string;
  readonly unsafeControlActionDescription: string;

  readonly unsafeControlActionChips: Chip[];

  constructor(
    controllerConstraint: ControllerConstraint,
    unsafeControlAction: UnsafeControlAction,
    unsafeControlActionChips: Chip[]
  ) {
    super(controllerConstraint);
    this.tableId = ChipPrefix.ControllerConstraint + this.tableId;
    this.unsafeControlActionChips = unsafeControlActionChips;

    this.unsafeControlAction = unsafeControlAction;
    this.unsafeControlActionName = unsafeControlAction.name;
    this.unsafeControlActionDescription = unsafeControlAction.description;
  }
}
