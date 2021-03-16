import { State } from '@src-shared/Enums';
import { Arrowed, Described, Named, ProjectDependent, Stated } from '@src-shared/Interfaces';

export class Feedback implements ProjectDependent, Named, Described, Stated, Arrowed {
  readonly id: number = -1;
  readonly projectId: string = '';

  readonly arrowId: string = '';

  readonly name: string = '';
  readonly description: string = '';
  readonly state: State = State.TODO;
}
