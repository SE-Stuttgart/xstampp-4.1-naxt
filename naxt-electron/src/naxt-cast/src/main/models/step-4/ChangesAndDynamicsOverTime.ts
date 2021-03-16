import { State } from '@src-shared/Enums';
import { Described, IdString, Label, Named, ProjectId, Stated } from '@src-shared/Interfaces';

export class ChangesAndDynamicsOverTime implements ProjectId, IdString, Label, Described, Named, Stated {
  readonly id: string = '';
  readonly projectId: string = '';

  readonly label: string = '';

  readonly name: string = '';
  readonly state: State = State.TODO;
  readonly description: string = '';
  readonly descriptionTextField: string = '';
}
