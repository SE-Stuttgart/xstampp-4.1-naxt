import { State } from '@src-shared/Enums';
import { Rule } from '../../../../models';
import { Chip, ChipPrefix } from '../Chip';
import { EntityDependentTableEntry } from '../common/EntityDependentTableEntry';

export class ControlAlgorithmTableEntry extends EntityDependentTableEntry implements Rule {
  readonly id: number;
  readonly parentId: number;
  readonly projectId: string;
  readonly tableId: string;

  name: string;
  description: string;
  state: State;

  controlActionId: number;
  controllerId: number;
  rule: string;

  // controllerName: string;

  get controllerName(): string {
    return this.controllerChips[0]?.name ?? '';
  }

  readonly controllerChips: Chip[];
  readonly controlActionChips: Chip[];

  constructor(rule: Rule, controllerChips: Chip[], controlActionChips: Chip[]) {
    super(rule);
    this.tableId = ChipPrefix.ControlAlgorithm + this.tableId;
    this.controlActionId = rule.controlActionId;
    this.controllerId = rule.controllerId;
    this.rule = rule.rule;

    this.controllerChips = controllerChips;
    this.controlActionChips = controlActionChips;

    // this.controllerName = controllerChips[0]?.name;
  }
}
