import { State } from '@src-shared/Enums';
import { EntityDependent, Stated } from '@src-shared/Interfaces';

export class Rule implements EntityDependent, Stated {
  readonly id: number = -1;
  readonly parentId: number = -1; // controller
  readonly projectId: string = '';

  readonly rule: string = '';
  readonly controlActionId: number = -1;
  readonly controllerId: number = -1; // unused field in old web system

  readonly name: string = '';
  readonly description: string = '';
  readonly state: State = State.TODO;
}
