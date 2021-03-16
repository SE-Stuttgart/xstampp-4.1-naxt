import { State } from '../../../../../../../shared/Enums';
import { SafetyCulture } from '../../../../models';
import { Chip, ChipPrefix } from '../../Chip';
import { TableModel } from '../common/TableModel';

export class SafetyCultureTableModel extends TableModel implements SafetyCulture {
  description: string;
  name: string;
  state: State;
  descriptionTextField: string;
  fileName: string;
  path: string;

  readonly linkedControllers: Chip[];
  readonly linkedQuestions: string[];

  constructor(safetyCulture: SafetyCulture, linkedControllers: Chip[], linkedQuestions: string[]) {
    super(ChipPrefix.SafetyCulture, safetyCulture);

    this.description = safetyCulture.description;
    this.name = safetyCulture.name;
    this.state = safetyCulture.state;
    this.descriptionTextField = safetyCulture.descriptionTextField;
    this.linkedControllers = linkedControllers;
    this.linkedQuestions = linkedQuestions;
  }
}
