import { State } from '@src-shared/Enums';
import { Responsibility } from '../../../../models';
import { Chip, ChipPrefix } from '../../Chip';
import { TableModel } from '../common/TableModel';

export class ResponsibilityTableModel extends TableModel implements Responsibility {
  description: string;
  name: string;
  state: State;

  readonly linkedControllers: Chip[];
  readonly linkedConstraints: Chip[];
  linkedQuestions: string[];

  constructor(
    responsibility: Responsibility,
    linkedConstraints: Chip[],
    linkedControllers: Chip[],
    linkedQuestions: string[]
  ) {
    super(ChipPrefix.Responsibility, responsibility);

    this.description = responsibility.description;
    this.name = responsibility.name;
    this.state = responsibility.state;

    this.linkedConstraints = linkedConstraints;
    this.linkedControllers = linkedControllers;
    this.linkedQuestions = linkedQuestions;
  }
}
