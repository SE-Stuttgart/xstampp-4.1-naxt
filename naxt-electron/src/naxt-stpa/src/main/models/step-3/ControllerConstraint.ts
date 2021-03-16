import { State } from '@src-shared/Enums';
import { Described, EntityDependent, Named, Stated } from '@src-shared/Interfaces';

export class ControllerConstraint implements EntityDependent, Named, Described, Stated {
  readonly id: number = -1;
  readonly parentId: number = -1;
  readonly projectId: string = '';

  readonly description: string = '';
  readonly name: string = '';
  readonly state: State = State.TODO;
}
