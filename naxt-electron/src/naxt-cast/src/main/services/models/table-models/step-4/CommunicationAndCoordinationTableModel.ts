import { State } from '../../../../../../../shared/Enums';
import { CommunicationAndCoordination } from '../../../../models';
import { Chip, ChipPrefix } from '../../Chip';
import { TableModel } from '../common/TableModel';

export class CommunicationAndCoordinationTableModel extends TableModel implements CommunicationAndCoordination {
  description: string;
  name: string;
  state: State;
  descriptionTextField: string;
  fileName: string;
  path: string;

  readonly controllers1Chips: Chip[];
  readonly controllers2Chips: Chip[];

  constructor(
    communicationAndCoordination: CommunicationAndCoordination,
    controllers1Chips: Chip[],
    controllers2Chips: Chip[]
  ) {
    super(ChipPrefix.CommunicationAndCoordination, communicationAndCoordination);

    this.description = communicationAndCoordination.description;
    this.name = communicationAndCoordination.name;
    this.state = communicationAndCoordination.state;

    this.controllers1Chips = controllers1Chips;
    this.controllers2Chips = controllers2Chips;
    this.descriptionTextField = communicationAndCoordination.descriptionTextField;
  }
}
