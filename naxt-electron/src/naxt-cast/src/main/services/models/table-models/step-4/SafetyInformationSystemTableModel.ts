import { State } from '../../../../../../../shared/Enums';
import { SafetyInformationSystem } from '../../../../models';
import { Chip, ChipPrefix } from '../../Chip';
import { TableModel } from '../common/TableModel';

export class SafetyInformationSystemTableModel extends TableModel implements SafetyInformationSystem {
  description: string;
  name: string;
  state: State;
  descriptionTextField: string;
  fileName: string;
  path: string;

  readonly linkedControllers: Chip[];
  readonly linkedQuestions: string[];

  constructor(safetyInformationSystem: SafetyInformationSystem, linkedControllers: Chip[], linkedQuestions: string[]) {
    super(ChipPrefix.SafetyInformation, safetyInformationSystem);

    this.description = safetyInformationSystem.description;
    this.name = safetyInformationSystem.name;
    this.state = safetyInformationSystem.state;
    this.descriptionTextField = safetyInformationSystem.descriptionTextField;
    this.linkedControllers = linkedControllers;
    this.linkedQuestions = linkedQuestions;
  }
}
