import { ChipPrefix } from '@cast/src/main/services/models/Chip';
import { State } from '@src-shared/Enums';
import { Event } from '../../../../models';
import { TableModel } from '../common/TableModel';

export class EventTableModel extends TableModel implements Event {
  description: string;
  name: string;
  state: State;
  readonly linkedQuestions: string[];

  constructor(event: Event, linkedQuestions: string[]) {
    super(ChipPrefix.Event, event);

    this.description = '';
    this.name = event.name;
    this.state = event.state;
    this.linkedQuestions = linkedQuestions;
  }
}
