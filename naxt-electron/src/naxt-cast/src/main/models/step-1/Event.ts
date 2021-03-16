import { State } from '@src-shared/Enums';
import { IdString, Label, Named, ProjectId, Stated } from '@src-shared/Interfaces';

export class Event implements ProjectId, IdString, Label, Named, Stated {
  readonly id: string = '';
  readonly projectId: string = '';

  readonly label: string = '';

  readonly name: string = '';
  readonly state: State = State.TODO;
}
