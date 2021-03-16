import { State } from '@src-shared/Enums';
import { Described, Named, ProjectDependent, Stated } from '@src-shared/Interfaces';

export class Responsibility implements ProjectDependent, Named, Described, Stated {
  readonly id: number = -1;
  readonly projectId: string = '';

  readonly controllerId: number = -1;
  readonly controllerProjectId: string = '';

  readonly name: string = '';
  readonly description: string = '';
  readonly state: State = State.TODO;
}
