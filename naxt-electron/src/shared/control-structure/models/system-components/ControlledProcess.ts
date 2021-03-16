import { State } from '@src-shared/Enums';
import { Boxed, Described, Named, ProjectDependent, Stated } from '@src-shared/Interfaces';

export class ControlledProcess implements ProjectDependent, Named, Described, Stated, Boxed {
  readonly id: number = -1;
  readonly projectId: string = '';

  readonly boxId: string = '';

  readonly name: string = '';
  readonly description: string = '';
  readonly state: State = State.TODO;
}
