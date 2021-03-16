import { State } from '@src-shared/Enums';
import { Described, EntityDependent, Named, Stated } from '@src-shared/Interfaces';

export class SubHazard implements EntityDependent, Named, Described, Stated {
  readonly id: number = -1;
  readonly parentId: number = -1;
  readonly projectId: string = '';

  readonly name: string = '';
  readonly description: string = '';
  readonly state: State = State.TODO;
}
