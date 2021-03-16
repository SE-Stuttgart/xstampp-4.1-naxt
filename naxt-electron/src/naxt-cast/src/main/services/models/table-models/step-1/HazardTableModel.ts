import { State } from '@src-shared/Enums';
import { Hazard } from '../../../../models';
import { Chip, ChipPrefix } from '../../Chip';
import { TableModel } from '../common/TableModel';

export class HazardTableModel extends TableModel implements Hazard {
  description: string;
  name: string;
  state: State;

  readonly linkedConstraints: Chip[];
  readonly linkedQuestions: string[];

  constructor(hazard: Hazard, linkedConstraints: Chip[], linkedQuestions: string[]) {
    super(ChipPrefix.Hazard, hazard);

    this.description = hazard.description;
    this.name = hazard.name;
    this.state = hazard.state;

    this.linkedConstraints = linkedConstraints;
    this.linkedQuestions = linkedQuestions;
  }
}
