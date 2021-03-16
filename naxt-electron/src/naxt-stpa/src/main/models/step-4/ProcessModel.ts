import { State } from '../../../../../shared/Enums';
import { Described, Named, ProjectDependent, Stated } from '../../../../../shared/Interfaces';

export class ProcessModel implements ProjectDependent, Named, Described, Stated {
  readonly id: number = -1;
  readonly projectId: string = '';

  readonly controllerId: number = -1;

  readonly name: string = '';
  readonly description: string = '';
  readonly state: State = State.TODO;
}
