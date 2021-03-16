import { State } from '../../../../../../../shared/Enums';
import { ChangesAndDynamicsOverTime } from '../../../../models';
import { Chip, ChipPrefix } from '../../Chip';
import { TableModel } from '../common/TableModel';

export class ChangesAndDynamicsOverTimeTableModel extends TableModel implements ChangesAndDynamicsOverTime {
  description: string;
  name: string;
  state: State;
  descriptionTextField: string;
  fileName: string;
  path: string;

  readonly linkedControllers: Chip[];
  readonly linkedQuestions: string[];

  constructor(
    changesAndDynamicsOverTime: ChangesAndDynamicsOverTime,
    linkedControllers: Chip[],
    linkedQuestions: string[]
  ) {
    super(ChipPrefix.ChangesAndDynamicsOverTime, changesAndDynamicsOverTime);

    this.description = changesAndDynamicsOverTime.description;
    this.name = changesAndDynamicsOverTime.name;
    this.state = changesAndDynamicsOverTime.state;

    this.linkedControllers = linkedControllers;
    this.descriptionTextField = changesAndDynamicsOverTime.descriptionTextField;
    this.linkedQuestions = linkedQuestions;
  }
}
