import { State } from '../../../../../../../shared/Enums';
import { InternalAndExternalEconomics } from '../../../../models';
import { Chip, ChipPrefix } from '../../Chip';
import { TableModel } from '../common/TableModel';

export class InternalAndExternalEconomicsTableModel extends TableModel implements InternalAndExternalEconomics {
  description: string;
  name: string;
  state: State;
  descriptionTextField: string;
  fileName: string;
  path: string;

  readonly linkedControllers: Chip[];
  readonly linkedQuestions: string[];

  constructor(
    internalAndExternalEconomics: InternalAndExternalEconomics,
    linkedControllers: Chip[],
    linkedQuestions: string[]
  ) {
    super(ChipPrefix.InternalAndExternalEconomics, internalAndExternalEconomics);

    this.description = internalAndExternalEconomics.description;
    this.name = internalAndExternalEconomics.name;
    this.state = internalAndExternalEconomics.state;
    this.descriptionTextField = internalAndExternalEconomics.descriptionTextField;

    this.linkedControllers = linkedControllers;
    this.linkedQuestions = linkedQuestions;
  }
}
