import { State } from '@src-shared/Enums';
import { Described, IdString, Label, Named, ProjectId, Stated } from '@src-shared/Interfaces';

export class Responsibility implements ProjectId, IdString, Label, Named, Described, Stated {
  readonly id: string = '';
  readonly projectId: string = '';

  readonly label: string = '';

  readonly name: string = '';
  readonly description: string = '';
  readonly state: State = State.TODO;
}
