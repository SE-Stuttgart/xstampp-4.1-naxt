import { State } from '@src-shared/Enums';
import { Constraint } from '../../../../models';
import { Chip, ChipPrefix } from '../../Chip';
import { TableModel } from '../common/TableModel';

export class ConstraintTableModel extends TableModel implements Constraint {
  description: string;
  name: string;
  state: State;

  readonly linkedHazard: Chip[];
  readonly linkedQuestions: string[];

  constructor(constraint: Constraint, linkedHazard: Chip[], linkedQuestions: string[]) {
    super(ChipPrefix.Constraint, constraint);

    this.description = constraint.description;
    this.name = constraint.name;
    this.state = constraint.state;

    this.linkedHazard = linkedHazard;
    this.linkedQuestions = linkedQuestions;
  }
}
