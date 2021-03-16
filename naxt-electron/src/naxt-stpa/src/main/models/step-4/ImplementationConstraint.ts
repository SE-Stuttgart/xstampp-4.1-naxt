import { State } from '@src-shared/Enums';
import { Described, Named, ProjectDependent, Stated } from '@src-shared/Interfaces';

export class ImplementationConstraint implements ProjectDependent, Named, Described, Stated {
  readonly id: number = -1;
  readonly projectId: string = '';

  readonly name: string = '';
  readonly state: State = State.TODO;
  readonly description: string = '';
  readonly lossScenarioId: number = -1;
}
