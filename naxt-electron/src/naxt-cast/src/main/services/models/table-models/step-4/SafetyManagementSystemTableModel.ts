import { State } from '../../../../../../../shared/Enums';
import { SafetyManagementSystem } from '../../../../models';
import { Chip, ChipPrefix } from '../../Chip';
import { TableModel } from '../common/TableModel';

export class SafetyManagementSystemTableModel extends TableModel implements SafetyManagementSystem {
  description: string;
  name: string;
  state: State;
  descriptionTextField: string;
  fileName: string;
  path: string;

  readonly linkedControllers: Chip[];
  readonly linkedQuestions: string[];

  constructor(safetyManagementSystem: SafetyManagementSystem, linkedControllers: Chip[], linkedQuestions: string[]) {
    super(ChipPrefix.SafetyManagement, safetyManagementSystem);

    this.description = safetyManagementSystem.description;
    this.name = safetyManagementSystem.name;
    this.state = safetyManagementSystem.state;
    this.descriptionTextField = safetyManagementSystem.descriptionTextField;
    this.linkedControllers = linkedControllers;
    this.linkedQuestions = linkedQuestions;
  }
}
