import { State } from '@src-shared/Enums';
import { Described, EntityDependent, Named, Stated } from '@src-shared/Interfaces';

export class ConversionSensor implements EntityDependent, Named, Described, Stated {
  readonly id: number = -1;
  readonly parentId: number = -1; // equals sensor
  readonly projectId: string = '';

  readonly conversion: string = '';
  readonly controlActionId: number = -1; // linked control action

  readonly name: string;
  readonly description: string;
  readonly state: State = State.TODO;
}
